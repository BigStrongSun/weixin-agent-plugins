import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
/**
 * Resolve the openclaw CLI entry (openclaw.mjs) from the same installation
 * that loaded this plugin, so the spawned CLI talks to the same gateway.
 */
function resolveCliEntry() {
    try {
        const require = createRequire(import.meta.url);
        const sdkPath = require.resolve("openclaw/plugin-sdk/plugin-entry");
        // sdkPath = <openclawRoot>/dist/plugin-sdk/plugin-entry.js
        const root = path.resolve(sdkPath, "..", "..", "..");
        const entry = path.join(root, "openclaw.mjs");
        return entry;
    }
    catch {
        return null;
    }
}
function cliSend(cliEntry, params) {
    return new Promise((resolve, reject) => {
        execFile(process.execPath, [cliEntry, "gateway", "call", "send", "--params", JSON.stringify(params), "--json"], { timeout: 30_000, maxBuffer: 1024 * 1024 }, (error, stdout) => {
            if (error) {
                reject(new Error(`${error.message} ${String(stdout ?? "").slice(0, 200)}`));
                return;
            }
            try {
                const out = JSON.parse(String(stdout));
                if (out && out.ok === false) {
                    reject(new Error(out.error?.message ?? "gateway send failed"));
                    return;
                }
                resolve();
            }
            catch (e) {
                reject(e instanceof Error ? e : new Error(String(e)));
            }
        });
    });
}
/**
 * Extract the final assistant reply text from an agent_end `messages` array.
 * Handles content as a plain string or as an array of content parts.
 */
function extractFinalReply(messages) {
    if (!Array.isArray(messages))
        return "";
    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (!m || m.role !== "assistant")
            continue;
        const c = m.content;
        if (typeof c === "string")
            return c.trim();
        if (Array.isArray(c)) {
            const texts = c
                .filter((p) => p && p.type === "text" && typeof p.text === "string")
                .map((p) => p.text);
            const joined = texts.join("\n").trim();
            if (joined)
                return joined;
        }
    }
    return "";
}
/** Strip OpenClaw reply directives so the clone matches what the user sees. */
function stripDirectives(text) {
    return text
        .split("\n")
        .filter((line) => !/^\s*(\[\[|MEDIA:)/.test(line))
        .join("\n")
        .trim();
}
export default definePluginEntry({
    id: "cross-channel-notify",
    name: "Cross Channel Notify",
    description: "Mirror the main session across channels: notify on inbound from other channels, and clone main-session replies to a configured channel (e.g. WeChat).",
    register(api) {
        const cfg = (api.pluginConfig ?? {});
        const notifyChannel = cfg.notifyChannel ?? "openclaw-weixin";
        const notifyTo = cfg.notifyTo;
        if (!notifyTo) {
            api.logger.warn("cross-channel-notify: notifyTo is not configured; plugin is idle. Set plugins.entries.cross-channel-notify.config.notifyTo");
            return;
        }
        const skip = new Set(cfg.skipChannels ?? [notifyChannel]);
        const maxLen = cfg.maxContentLength ?? 120;
        const cooldownMs = cfg.cooldownMs ?? 30_000;
        const syncReplies = cfg.syncReplies ?? true;
        const syncSessionKey = cfg.syncSessionKey;
        const replyPrefix = cfg.replyPrefix ?? "";
        const lastInbound = new Map();
        const cliEntry = resolveCliEntry();
        if (!cliEntry) {
            api.logger.warn("cross-channel-notify: could not resolve openclaw CLI entry; plugin is idle.");
            return;
        }
        const sendToNotify = (text, idemPrefix) => cliSend(cliEntry, {
            channel: notifyChannel,
            to: notifyTo,
            ...(cfg.notifyAccountId ? { accountId: cfg.notifyAccountId } : {}),
            message: text,
            idempotencyKey: `${idemPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        });
        // --- Inbound: other channel -> short notification on the notify channel ---
        api.on("message_received", async (event, ctx) => {
            try {
                const ev = event;
                const c = ctx;
                const rawChannel = (c.channelId ?? "").toLowerCase();
                // Skip the destination channel (e.g. weixin) to avoid self-notification.
                // Everything else (webchat, telegram, ... or an empty/internal surface) notifies.
                if (rawChannel && skip.has(rawChannel))
                    return;
                const channelId = rawChannel || "webchat";
                const sender = ev.senderId ?? ev.from ?? "unknown";
                const key = `${channelId}:${sender}`;
                const now = Date.now();
                if (now - (lastInbound.get(key) ?? 0) < cooldownMs)
                    return;
                lastInbound.set(key, now);
                const content = (ev.content ?? "").trim().replace(/\s+/g, " ");
                const preview = content.length > maxLen ? `${content.slice(0, maxLen)}…` : content;
                const text = `🔔 跨渠道提醒 [${channelId}] ${sender}${preview ? `: ${preview}` : ""}`;
                await sendToNotify(text, "ccn-in");
                api.logger.info(`cross-channel-notify: notified ${notifyChannel} about ${channelId} message from ${sender}`);
            }
            catch (err) {
                api.logger.warn(`cross-channel-notify: inbound notify failed: ${String(err)}`);
            }
        });
        // --- Outbound: main-session reply -> clone (as-is) to the notify channel ---
        // Uses agent_end (fires once per run, on every channel incl. webchat, and is
        // NOT triggered by our own CLI send -> no loop).
        api.on("agent_end", async (event, ctx) => {
            if (!syncReplies)
                return;
            try {
                const ev = event;
                const c = ctx;
                const sessionKey = c.sessionKey ?? "";
                // The agent_end context carries the channel NAME in `channel` and the
                // chat/recipient id in `channelId`. The skip set holds channel names,
                // so match on `channel` (with `channelId` as a shape-variation fallback).
                // Previously this used `channelId` first, which is the chat id (e.g.
                // "xxx@im.wechat"), so the skip check never matched and replies from the
                // notify channel itself were cloned again -> duplicate messages.
                const srcChannel = (c.channel ?? "").toLowerCase();
                const srcChannelId = (c.channelId ?? "").toLowerCase();
                const messages = Array.isArray(ev.messages) ? ev.messages : [];
                const lastRole = messages.length ? messages[messages.length - 1]?.role : undefined;
                api.logger.info(`cross-channel-notify: agent_end observed success=${ev.success} session=${sessionKey || "?"} channel=${c.channel ?? "?"} channelId=${c.channelId ?? "?"} trigger=${c.trigger ?? "?"} messages=${messages.length} lastRole=${lastRole ?? "?"}`);
                if (ev.success === false)
                    return;
                // Session filter: only clone the main session (or an explicitly pinned one).
                if (syncSessionKey) {
                    if (sessionKey !== syncSessionKey)
                        return;
                }
                else if (sessionKey && !sessionKey.endsWith(":main")) {
                    return;
                }
                // If the reply was already delivered to the notify channel (user was on
                // that channel), skip to avoid a duplicate.
                if ((srcChannel && skip.has(srcChannel)) || (srcChannelId && skip.has(srcChannelId)))
                    return;
                const raw = extractFinalReply(ev.messages);
                if (!raw)
                    return;
                const text0 = stripDirectives(raw);
                if (!text0 || /^NO_REPLY$/i.test(text0))
                    return;
                const text = replyPrefix ? `${replyPrefix}${text0}` : text0;
                await sendToNotify(text, "ccn-sync");
                api.logger.info(`cross-channel-notify: cloned reply [${srcChannel || "webchat"}] session=${sessionKey || "?"} -> ${notifyChannel} (${text0.length} chars)`);
            }
            catch (err) {
                api.logger.warn(`cross-channel-notify: reply clone failed: ${String(err)}`);
            }
        });
    },
});
