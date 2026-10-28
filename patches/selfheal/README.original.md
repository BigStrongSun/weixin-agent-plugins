# openclaw-weixin 会话自愈补丁（微信渠道 prepare failed 修复）

> 针对 OpenClaw 微信渠道插件 **`@tencent-weixin/openclaw-weixin`**（腾讯官方插件，[GitHub: Tencent/openclaw-weixin](https://github.com/Tencent/openclaw-weixin)）的本地补丁，修复 `sendMessage ret=-2 errmsg=prepare failed` 导致的**"收得到消息、发不出消息"半死状态**。
>
> 关键词：OpenClaw · 微信 · Weixin · clawbot · ilink · 长轮询 · 会话降级 · 自愈

## 问题背景

微信 bot 的长轮询会话在服务器端可能进入**降级态**：长轮询（`getUpdates`）出现 TLS 断连或零星网络失败后，服务器端会话不再健康，但客户端看起来"还连着"。此时：

- **收消息正常**（长轮询还能拉到消息）
- **发消息全部失败**：`sendMessage ret=-2 errmsg=prepare failed`

`prepare failed` 有两种成因：

| 成因 | 特征 | 修复方式 |
|---|---|---|
| ① context_token 过期 | 带 context_token 的请求失败；**不带 token 重试可成功**（实测：token 是可选参数） | 去掉 context_token 重试一次 |
| ② 服务器端 bot 会话降级 | 带不带 token 都失败 | 必须重建会话（`notifyStart` + 渠道热重载） |

原版插件（2.4.9）对成因 ① 没有任何处理（直接抛错，消息丢）；对成因 ② 只在"连续 5 次**网络级** `getUpdates` 失败"时触发恢复——而实际降级往往由零星失败引起（计数器被成功轮询不断重置），永远凑不够 5 次，于是渠道半死数小时，直到服务器端会话自己过期重建。

> ⚠️ 注意：`ret=-2 prepare failed` 这个错误码**不在官方协议文档中**（官方 [protocol.md](https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol.md) 只文档化了 `ret=-14` token 过期）。本补丁基于实测逆向发现，属于经验性修复，不是官方契约。

## 补丁设计

三层防线，全部在插件内部，无需外部监控：

### 第 1 层：发送侧 token 降级重试（`src/messaging/send.ts`）

- `isStaleContextTokenError(err)`：匹配 `prepare failed` 或 `ret=-2`
- `sendWithStaleTokenFallback(sendParams, label, accountId)`：

```
sendMessageApi(sendParams)
  └─ 失败且 isStaleContextTokenError 且请求带 context_token
       └─ 去掉 context_token 重试一次
            ├─ 成功 → 返回（消息不丢，成因①自愈）
            └─ 仍失败且同错 → 触发 recoverWeixinSession()（成因②自愈）
  └─ 其他错误 → 原样抛出
```

三个发送调用点（`sendMessageWeixin` 文本、`sendMessageItemWeixin` 单 item、多 item 循环）全部从直接调 `sendMessageApi` 改为走 `sendWithStaleTokenFallback`。

### 第 2 层：无 token 发送的降级检测（`src/messaging/send.ts`）

**关键漏洞**：cron 直发、主动推送等场景**不带 context_token**，第 1 层的重试分支永远不会执行，失败直接抛出——渠道照样半死。

补充：发送失败且 `isStaleContextTokenError` 且请求**不带** context_token 时，直接判定会话降级，触发 `recoverWeixinSession()`。

### 第 3 层：长轮询侧主动恢复（`src/monitor/monitor.ts`）

新增常量 `MAX_NETWORK_FAILURES_BEFORE_RECOVERY = 5`：`getUpdates` 连续 5 次**网络级**失败（区别于业务错误码）时，主动触发 `recoverWeixinSession()`，而不是只 backoff 30s 继续等。

> 已知局限：零星失败（中间夹成功轮询）仍不会触发此层——这正是第 1/2 层存在的意义：发送侧兜底。

### 恢复核心：`src/api/session-recovery.ts`（新文件）

```
recoverWeixinSession({ accountId, baseUrl, token })
  1. 冷却检查：同 accountId 60s 内只恢复一次（防失败风暴反复 reload）
  2. notifyStart()   — 向微信服务器重新声明客户端（轻量，可能单独修复轻度降级）
  3. triggerWeixinChannelReload() — 写 openclaw.json 的 channelConfigUpdatedAt，
     网关热重载渠道：stopAccount(notifyStop) + startAccount(notifyStart + 新长轮询)
     （与扫码登录后的重载同一条路径，是插件原生支持的安全操作）
  4. 失败时清除冷却记录，允许下次立即重试
```

冷却 60s 是进程内 Map（`lastRecovery`），网关重启后重置——可接受，因为重启本身就是完整恢复。

## 补丁文件

- [`patches/weixin-session-selfheal-2.4.9.patch`](patches/weixin-session-selfheal-2.4.9.patch) — 针对 `@tencent-weixin/openclaw-weixin@2.4.9` 的 unified diff（3 个文件：`send.ts` 修改、`monitor.ts` 修改、`session-recovery.ts` 新增），已验证 `patch -p1 --dry-run` 通过。

## 应用方式

```bash
# 1. 找到插件安装目录（openclaw plugins list 可查）
PLUGIN=~/.openclaw/npm/projects/tencent-weixin-openclaw-weixin-*/node_modules/@tencent-weixin/openclaw-weixin

# 2. 备份 + 应用补丁（src 源码）
cp $PLUGIN/src/messaging/send.ts $PLUGIN/src/messaging/send.ts.bak
cp $PLUGIN/src/monitor/monitor.ts $PLUGIN/src/monitor/monitor.ts.bak
cd $PLUGIN && patch -p1 < /path/to/weixin-session-selfheal-2.4.9.patch

# 3. 重新编译（插件带 tsc 构建链；若 node_modules 内无 tsconfig，
#    可参照 dist 产物手工同步 send.js / monitor.js，或让插件重新 build）
# 4. 重载插件
openclaw plugins reload openclaw-weixin
```

⚠️ **注意**：

- **插件升级（npm 重装）会覆盖补丁**，需要重新应用。
- **`openclaw plugins reload` 的坑**：agent 回合占用插件（`admitted work`）时会半失败，把渠道搞断（旧实例拆了、新实例起不来）。安全做法：等空闲时执行，或失败后由独立进程（cron command 任务）重试；最彻底的恢复是 `openclaw gateway restart`。
- 补丁只改发送/监控路径，不动登录、鉴权、消息处理逻辑。

## 配套运维措施（非代码）

- **定时任务发送失败重试**：依赖微信推送的 cron 任务，prompt 中加"发送失败（prepare failed / ret=-2）时 sleep 60 后重试一次"——给第 1/2 层触发的会话恢复留出时间窗口。
- **日志关键字**：`session-recovery`、`stale context_token`、`prepare failed without context_token`、`consecutive network failures, triggering session recovery`。

## 适用范围

- **补丁代码**：OpenClaw 微信渠道插件专属（恢复机制依赖 OpenClaw 的渠道热重载）。
- **协议本身是通用的**：微信 bot 后端是标准 HTTP JSON API（`getUpdates` / `sendMessage` / `notifyStart` / `notifyStop`，默认地址 `https://ilinkai.weixin.qq.com`），任何客户端都可以实现。官方协议文档见 [protocol.md](https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol.md)（[中文版](https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol_zh_CN.md)）。
- **自研客户端可借鉴的思路**：① `prepare failed` 时去 context_token 重试；② 重试仍失败则 `notifyStart` + 重建长轮询会话；③ 加冷却防恢复风暴。

## 验证记录

- 2026-10-03：首次补丁（第 1、3 层 + `session-recovery.ts`）
- 2026-10-07：补第 2 层（无 token 路径）。当日 12:03 前渠道处于降级态（收正常/发失败，持续约 16 小时），12:03 服务器端会话过期重建后恢复；14:08 插件重载后补丁全量生效，微信收发双向验证通过。

## License

补丁代码 MIT。基于 `@tencent-weixin/openclaw-weixin`（腾讯微信官方 OpenClaw 插件，MIT）。
