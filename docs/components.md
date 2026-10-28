# 组件目录与关系

核查日期：2026-10-28。

## 1. 腾讯微信渠道插件：通信底座

- 仓库：https://github.com/Tencent/openclaw-weixin
- npm：https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin
- 包名：@tencent-weixin/openclaw-weixin；渠道 ID：openclaw-weixin。
- 承担扫码认证、getUpdates 入站、sendMessage 出站、媒体传输及上下文处理。
- 我们的 fork：https://github.com/BigStrongSun/openclaw-weixin
- 不能用“已启用 / running / configured”替代实际收发验证。

## 2. Cross Channel Notify：自有配套插件

- [归档源码、配置清单与使用边界](../components/cross-channel-notify/README.md)
- 监听 message_received：其他渠道有消息时向目标渠道发送简短提醒。
- 监听 agent_end：选取主会话最后的 assistant 文本回复并抄送目标渠道。
- 有来源渠道跳过、会话筛选、入站冷却和 NO_REPLY 过滤逻辑。
- 依赖底层目标渠道可发送；它不是微信协议客户端，也不会修复微信会话。
- 原 package.json 的 private=true 是禁止 npm 公开发布的标志，不证明此前存在 GitHub 私有仓库。

## 3. 自愈补丁：自有公开项目

- https://github.com/BigStrongSun/openclaw-weixin-session-selfheal
- https://github.com/BigStrongSun/openclaw-weixin-session-selfheal/blob/main/patches/weixin-session-selfheal-2.4.9.patch
- 处理 prepare failed / ret=-2、去 context_token 重试、会话恢复和连续网络失败。
- 详见 [补丁矩阵](../patches/README.md)。

## 4. fork 中的开发分支与上游贡献

| PR | 分支链接 | 目的 | 核查时状态 |
|---|---|---|---|
| [#328](https://github.com/Tencent/openclaw-weixin/pull/328) | [fix/outbound-send-success-logging](https://github.com/BigStrongSun/openclaw-weixin/tree/fix/outbound-send-success-logging) | 为文本与 item 发送补充 INFO 成功日志及服务端 message_id | OPEN |
| [#331](https://github.com/Tencent/openclaw-weixin/pull/331) | [fix/stale-context-token-fallback](https://github.com/BigStrongSun/openclaw-weixin/tree/fix/stale-context-token-fallback) | stale context_token 被拒时去 token 重试一次 | OPEN |
| [#335](https://github.com/Tencent/openclaw-weixin/pull/335) | [fix/weixin-session-selfheal](https://github.com/BigStrongSun/openclaw-weixin/tree/fix/weixin-session-selfheal) | 去 token 回退、无 token 失败检测、notifyStart 和渠道重建 | OPEN |

另有 docs/fix-readme-dm-scope-issue-12 分支，但没有在本次已核实的自有 PR 列表中找到对应 PR；不将它算作已提交或已合并的贡献。

## 5. 不属于独立插件的关联物

- 早报归档、补发队列、自动化任务属于投递业务流程，不是插件源码；不上传运行队列、收件人或聊天数据。
- debug-mode、引用消息、媒体缓存等模块名出现在官方插件源码/安装产物中；仅凭本机存在，不能认定是我们独立维护的组件。
- ACPsClaw、ACPs Adapter 是智能体互联工程。与微信的关联需逐项说明，不能因为名字含 Claw 或资料来自公众号就称作微信插件。
