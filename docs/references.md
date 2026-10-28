# 参考仓库、ClawHub、技术文档与公开讨论

核查日期：2026-10-28。以下区分“GitHub API 实际返回的对象”和“项目文档提供的服务入口”。没有把搜索引擎摘要当作已验证安装来源，也没有安装任何检索到的技能/插件。

## A. 官方微信通信组件

| 地址 | 用途 | 核验与边界 |
|---|---|---|
| https://github.com/Tencent/openclaw-weixin | 腾讯微信渠道插件源码 | GitHub API 可读；官方插件与我们自己的补丁分开 |
| https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin | npm 包页与版本入口 | 包名由已安装 package.json 确认；网页可用性不等于发送健康 |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol.md | 英文 HTTP 协议 | GitHub API 确认文件存在并记录 blob SHA |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol_zh_CN.md | 中文 HTTP 协议 | GitHub API 确认文件存在并记录 blob SHA |
| https://ilinkai.weixin.qq.com | 文档中的默认 API 地址 | 通信服务，不是项目官网；本次不请求账户接口或发送消息 |

许可证提醒：GitHub 元数据对腾讯上游 LICENSE 的识别结果为 Other，不把我们的 MIT 补丁许可证套用到腾讯整个仓库。使用时阅读上游当时的 LICENSE。

## B. OpenClaw 主项目与开发文档

- 主仓库：https://github.com/openclaw/openclaw
- 官方网站：https://openclaw.ai
- 官方技术文档：https://docs.openclaw.ai
- 插件开发文档（源码，已核实存在）：https://github.com/openclaw/openclaw/blob/main/docs/tools/plugin.md
- Skills 工作机制（源码，已核实存在）：https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md
- 编写 Skill（源码，已核实存在）：https://github.com/openclaw/openclaw/blob/main/docs/tools/creating-skills.md
- Skills 配置（源码，已核实存在）：https://github.com/openclaw/openclaw/blob/main/docs/tools/skills-config.md

源码文档随 main 变化；生产接入应回到实际使用版本的 tag/commit。不能把某个旧插件 README 的模板说明当作当前产品行为。

## C. ClawHub 生态与仓库

- 官方目录网站：https://clawhub.ai
- ClawHub 官方源码仓库：https://github.com/openclaw/clawhub （GitHub API 已确认仓库存在，MIT）。

本次没有证据证明 BigStrongSun 的 cross-channel-notify 或 selfheal 补丁已经发布到 ClawHub，不为它们构造不存在的作者/slug 页面。本库的 GitHub 私有归档也不等于 ClawHub 发布。

具体生态条目如果被列入下面的补充清单，只代表核实了元数据或可定位的页面，不代表安装过、安全审计通过或推荐替换当前微信底座。

## D. 我们的仓库、补丁和公开技术讨论

- fork：https://github.com/BigStrongSun/openclaw-weixin
- 独立自愈补丁仓库：https://github.com/BigStrongSun/openclaw-weixin-session-selfheal
- 中文设计文档：https://github.com/BigStrongSun/openclaw-weixin-session-selfheal/blob/main/README.md
- 公开补丁文件：https://github.com/BigStrongSun/openclaw-weixin-session-selfheal/blob/main/patches/weixin-session-selfheal-2.4.9.patch
- 发送成功日志 PR #328：https://github.com/Tencent/openclaw-weixin/pull/328
- stale-token 回退 PR #331：https://github.com/Tencent/openclaw-weixin/pull/331
- 会话自愈 PR #335：https://github.com/Tencent/openclaw-weixin/pull/335

三个 PR 是可确认的公开技术讨论/帖子入口，状态快照均为 OPEN。对应正文、base/head SHA 和 check 字段见 references/pr-*.json。对未找到的论坛、公众号或社交媒体推广帖子，不编造标题与链接。

## E. 自有私有项目中的关联文档

- Jev 微信源码研究参考：https://github.com/BigStrongSun/jev-research/blob/main/jev-references/26-openclaw-weixin-src.md
- ACPs 公众号资料库：https://github.com/BigStrongSun/ACPs-Agent-Adapter/tree/main/docs/research/acps-wechat-source-library
- ACPs 公众号文章目录：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/CATALOG.md
- ACPs 公众号机器索引：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/manifest.json
- ACPsClaw 工程：https://github.com/BigStrongSun/ACPsClaw

这些是当前账号可访问的私有资源，不适合转贴到公开 issue 或公开 README。资料库里的公众号文章与微信消息机器人属于不同主题；具体判断见 [私有仓库核查说明](private-repositories.md)。

## 核验记录与未覆盖范围

GitHub 仓库、协议文件和 OpenClaw 文档入口的核验记录保存在 [canonical-links.json](../references/canonical-links.json)。记忆语义搜索因 fts-only / qwen3-vl-embedding-2b-local 的索引模型不匹配暂停；本次以 GitHub、实际文件和定点内容核查补足，不把不可用的记忆搜索当作完整历史检索。外部 Web Search provider 曾失败，不能保证穷尽所有第三方帖子。
