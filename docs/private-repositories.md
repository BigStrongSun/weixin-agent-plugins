# 私有 GitHub 仓库核查

本次不是只找本机目录：使用已认证的 BigStrongSun GitHub 账号列出私有仓库，再通过 GitHub API 检查默认分支文件树并阅读候选 README 与具体文档。

范围：23 个自有私有仓库，其中 22 个非空、token-proxy-wit 为空；默认分支文件树未报告截断。查看了 weixin / wechat / cross-channel-notify / 微信 等路径线索。代码搜索空结果没有被当成“不存在”的证明，因此另做了文件树与定点内容核对。

## 确认相关的私有资料

### Jev 研究仓库

- 项目：https://github.com/BigStrongSun/jev-research
- 微信参考文件：https://github.com/BigStrongSun/jev-research/blob/main/jev-references/26-openclaw-weixin-src.md
- 核查提交：ce84472b79a417c1b8e00bc6e94a889fa4723781。
- 该文档标注 2026-09-26，本质是“本地源码引用（未复制）”，列出 36 个源码文件。不是完整的远端代码归档。
- 相关模块包括 API、认证、媒体、debug-mode、send、monitor 等；本库将官方仓库与协议文档作为可跨设备访问的来源，不沿用失效的本机 file URL。

### ACPs Agent Adapter 的公众号资料库

- 项目：https://github.com/BigStrongSun/ACPs-Agent-Adapter
- 资料库：https://github.com/BigStrongSun/ACPs-Agent-Adapter/tree/main/docs/research/acps-wechat-source-library
- README：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/README.md
- 文章目录：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/CATALOG.md
- 机器索引：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/manifest.json
- 核查提交：31937e51fab0f488d15a4d28b531f9bcfa86a135。
- 内容是 ACPs / 智能体互联公众号文章、版本演进与技术解读；源 README 称保留 84 篇，其中 81 篇全文、3 篇摘要。这里的“微信”表示文章发布平台，不是消息渠道插件实现。
- 因主题边界不同，只保留索引，不复制整套文章、图片或其他私有项目代码。

## 关联工程但不是已发现的微信插件

- https://github.com/BigStrongSun/ACPsClaw ：ACPs/AIP onboarding、注册认证、发现及联调工程。
- https://github.com/BigStrongSun/ACPs-Agent-Adapter-Connector ：Adapter 连接器。

## 未找到与局限

本次没有在默认分支路径和候选文档中确认第三个独立的“私有微信渠道插件仓库”，也未查到 cross-channel-notify 原有独立 GitHub 仓库。因此将该插件源码保存到本仓库，而不是虚构一个旧链接。

这并不等于所有分支、历史提交、其他账号或未推送代码中都不存在相关组件。精确扫描范围、提交和匹配路径见 [审计清单](../references/private-repository-audit.json)。
