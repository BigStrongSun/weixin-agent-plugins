# 微信智能体插件与组件资料库

**仓库：PRIVATE｜维护者：BigStrongSun｜资料核查日期：2026-10-28**

统一保存我们做过的微信智能体配套插件、补丁、上游贡献，以及 GitHub 私有项目中的关联资料。本库是组件归档和文档入口，**不是另一个腾讯官方渠道插件，也不代表已部署或已恢复微信收发**。不上传登录态、token、账户文件、聊天记录或运行配置。

## 先从这里找

| 内容 | 本仓库入口 | 原始仓库 / 讨论 |
|---|---|---|
| 微信跨渠道提醒与主会话回复抄送插件 | [components/cross-channel-notify](components/cross-channel-notify/README.md) | 自有插件，0.2.0；本次首次集中归档源码与构建快照，未查到它原有的独立 GitHub 仓库 |
| 会话自愈补丁（2.4.9） | [补丁说明与两个冷却版本](patches/README.md) | [自有公开补丁仓库](https://github.com/BigStrongSun/openclaw-weixin-session-selfheal) · [README](https://github.com/BigStrongSun/openclaw-weixin-session-selfheal/blob/main/README.md) |
| 上游 fork 与开发分支 | [组件目录](docs/components.md) | [BigStrongSun/openclaw-weixin](https://github.com/BigStrongSun/openclaw-weixin) |
| 成功发送 INFO 日志补丁 | [PR #328 diff](patches/upstream-prs/pr-328.diff) | [Tencent/openclaw-weixin#328](https://github.com/Tencent/openclaw-weixin/pull/328) |
| 过期 context_token 回退补丁 | [PR #331 diff](patches/upstream-prs/pr-331.diff) | [Tencent/openclaw-weixin#331](https://github.com/Tencent/openclaw-weixin/pull/331) |
| 会话降级自愈补丁 | [PR #335 diff](patches/upstream-prs/pr-335.diff) | [Tencent/openclaw-weixin#335](https://github.com/Tencent/openclaw-weixin/pull/335) |
| 之前私有仓库内的关联资料 | [私有仓库核查说明](docs/private-repositories.md) | [jev-research](https://github.com/BigStrongSun/jev-research) · [ACPs-Agent-Adapter](https://github.com/BigStrongSun/ACPs-Agent-Adapter) |
| 官方仓库、ClawHub、技术文档与帖子 | [完整参考链接](docs/references.md) | 见下方速查及核验说明 |
| 故障排查、部署边界、验证标准 | [运维与限制](docs/operations.md) | 归档不等于部署；状态不等于投递成功 |
| 来源版本、校验值与检查证据 | [归档来源](docs/provenance.md) · [机器清单](references/) | 保留 PR head SHA、补丁版本区别与文件 SHA-256 |

## 官方与生态参考速查

- 腾讯微信渠道插件：[Tencent/openclaw-weixin](https://github.com/Tencent/openclaw-weixin)
- 插件包：[npm / @tencent-weixin/openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin)
- 协议文档：[English](https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol.md) · [中文](https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol_zh_CN.md)
- OpenClaw 主项目：[openclaw/openclaw](https://github.com/openclaw/openclaw) · [官方文档](https://docs.openclaw.ai)
- ClawHub：[技能与插件目录](https://clawhub.ai) · [ClawHub 源码仓库](https://github.com/openclaw/clawhub)
- 与我们有关的公开技术讨论：[PR #328](https://github.com/Tencent/openclaw-weixin/pull/328) · [PR #331](https://github.com/Tencent/openclaw-weixin/pull/331) · [PR #335](https://github.com/Tencent/openclaw-weixin/pull/335)

更多具体 ClawHub 条目、OpenClaw 开发文档和第三方组件的核验结果，集中见 [references.md](docs/references.md)。**“官方渠道插件”“ClawHub 技能”“第三方框架”“自有补丁”不混为一谈。**

## 本次找回与澄清

- 核查了 BigStrongSun 账号下 23 个私有仓库的元数据和默认分支路径（22 个非空、1 个空仓库），并读取了候选项目的 README / 相关文档；这不是所有历史提交和所有分支的全文审计。
- 私有的 Jev 研究仓库确有微信插件源码参考文档，但原文只记录旧本机路径和文件名，**没有保存插件源码**。本库补上可远程访问的官方代码与协议入口。
- 私有 ACPs Adapter 的 wechat 目录是“智能体互联”公众号资料库，**不是微信消息机器人或渠道插件源码**。只作为关联背景资料链接，不把其中 84 篇文章重复搬进微信插件目录。
- 自有 fork 的 3 个修复 PR 在核查时均为 **OPEN，未合并**。PR 中的本地测试描述不等于 GitHub CI 验收。
- 旧自愈补丁面向 **2.4.9**；当前安装包记录为 **2.4.10**，未发现自愈模块和关键标记，不能宣称补丁仍生效。
- 已分别保留公开的 **60 秒**自愈补丁与本机未提交的 **15 分钟**冷却变体；后者不冒充已推送的上游版本。

## 使用边界

这里先做集中保存和可追溯文档，不自动安装、重载、登录、发送测试消息或改动运行中的 Gateway。原项目继续保留，不迁移、不删除、不改公开/私有属性。归档快照不自动跟随上游更新；后续更新应同步来源 SHA 和校验清单。

授权与保密范围见 [归档来源及许可](docs/provenance.md)。
