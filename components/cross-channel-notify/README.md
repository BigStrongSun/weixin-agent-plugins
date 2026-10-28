# Cross Channel Notify（自有插件归档）

版本：0.2.0。作用：跨渠道入站提醒 + 主会话最终回复抄送（默认目标渠道 openclaw-weixin）。

## 已保存

- src/index.ts：TypeScript 源码；
- dist/index.js：同时保存的历史构建快照；
- package.json / package-lock.json / tsconfig.json：依赖与构建信息；
- openclaw.plugin.json：插件清单；
- README.original.md：原 README 原样存档。

本次未查到该组件之前的独立 GitHub 仓库，因此首次集中归档于本私有仓库。源码/构建产物为快照，不宣称构建一致性或当前 SDK 兼容性已验证。

## 实现要点

- message_received：跳过目标渠道，按渠道+发送人做入站冷却，发送简短预览。
- agent_end：从最后的 assistant 消息抽取文本，筛选主会话，跳过已在目标渠道交付的回复，过滤 NO_REPLY。
- notifyTo 未设置时插件不发送；运行配置不在本仓库存档。
- syncReplies / syncSessionKey / replyPrefix 存在于源码，但**缺少于当前 manifest 的 configSchema**。schema 又禁止 additionalProperties，因此不能把这些键当作当前可直接配置的稳定接口。
- 原 README 残留 draft composer / Custom plugin UI 模板说明，与实际通知插件源码不一致。它只作为历史原文保存；使用本页作为当前说明。
- 内部调用 CLI Gateway send 是历史实现，不代表当前推荐或允许的集成方式。归档代码不自动获得执行授权。

## 最小配置形状（不包含真实账户）

以下只说明已声明字段，不是直接安装指令；请将占位符替换为本机私有配置，且不要提交真实值。

~~~json
{
  "notifyChannel": "openclaw-weixin",
  "notifyTo": "<WEIXIN_RECIPIENT_ID>",
  "notifyAccountId": "<OPTIONAL_ACCOUNT_ID>",
  "skipChannels": ["openclaw-weixin"],
  "maxContentLength": 120,
  "cooldownMs": 30000
}
~~~

## 后续产品化检查

1. 对照当前 OpenClaw 插件 SDK 适配消息接口和钩子上下文。
2. 同步 manifest schema 与源码参数，补充会话/渠道过滤测试。
3. 验证源代码与构建产物对应、类型检查及无重复发送。
4. 在微信底层出站可用后做隔离的端到端测试。

本次只做归档检查，不安装、不启动、不发送消息。原始源码不做功能修改。
