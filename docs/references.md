# 参考仓库、ClawHub、技术文档与公开讨论

核查日期：2026-10-28。以下区分“GitHub API 实际返回的对象”和“项目文档提供的服务入口”。没有把搜索引擎摘要当作已验证安装来源，也没有安装任何检索到的技能/插件。

## A. 官方微信通信组件

| 地址 | 用途 | 核验与边界 |
|---|---|---|
| https://github.com/Tencent/openclaw-weixin | 腾讯微信渠道插件源码 | GitHub API 可读；官方插件与我们自己的补丁分开 |
| https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin | npm 渠道运行包，查得 latest=2.4.10 | npm 元数据、官方 README 和安装包信息确认；版本不等于发送健康 |
| https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin-cli | 官方安装器包，查得 2.1.4 | npm 元数据确认；安装器不等于渠道运行包 |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol.md | 英文 HTTP 协议 | GitHub API 确认文件存在并记录 blob SHA |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/protocol_zh_CN.md | 中文 HTTP 协议 | GitHub API 确认文件存在并记录 blob SHA |
| https://ilinkai.weixin.qq.com | 文档中的默认 API 地址 | 通信服务，不是项目官网；本次不请求账户接口或发送消息 |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/development_zh_CN.md | 官方开发指南 | GitHub Contents API 确认，开发与本地构建流程 |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/ci_zh_CN.md | 官方 CI 指南 | GitHub Contents API 确认，质量检查流程 |
| https://github.com/Tencent/openclaw-weixin/blob/main/docs/quote-cache_zh_CN.md | 官方引用缓存说明 | GitHub Contents API 确认，评估引用补丁前先看现有能力 |
| https://github.com/Tencent/openclaw-weixin/blob/main/CHANGELOG.md | 官方版本变更 | 已读 2.4.10 条目：SDK 兼容与配对数据读取修复，没有宣称合入 #335 |

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

### 注册表确认的第三方 skill

下面准确 URL 来自注册表返回的 canonicalUrl，不能把它们当作腾讯官方渠道插件。没有安装，也没有对 skill 指导执行的本地改动做安全审计。

| 名称 / 维护者 | 准确页面 | 类别和核验结果 |
|---|---|---|
| Wechat Connect / manifoldor | https://clawhub.ai/manifoldor/skills/wechat | 官方插件安装与扫码连接的指导型 skill；registry official=false，网页 HTTP 200，标题与描述匹配 |
| 微信连接 / lanlan314 | https://clawhub.ai/lanlan314/skills/wechat | 安装连接指导；registry official=false，未单独抓取正文 |
| weixin-quote / yechang1450 | https://clawhub.ai/yechang1450/skills/weixin-quote | 指导修改微信插件以启用引用上下文；registry 确认，网页抓取超时、未审计源码；官方已有 quote cache，不能默认仍需此补丁 |
| weixin-debounce20s / yechang1450 | https://clawhub.ai/yechang1450/skills/weixin-debounce20s | 指导本地实现 20 秒连发合并；registry official=false，未审计当前版本兼容性 |
| Weixin / zhangifonly | https://clawhub.ai/zhangifonly/skills/weixin | 公众号 / 小程序 API 工具与手册，不是个人微信 iLink 渠道；registry 确认，网页抓取超时 |
| Baoyu Post To Wechat / jimliu | https://clawhub.ai/jimliu/skills/baoyu-post-to-wechat | 公众号内容发布，涉及 API / Chrome CDP 工作流；registry official=false，不是个人微信机器人 SDK |

### 另一个社区 code-plugin

注册表另返回 newfuture 发布的 openclaw-wechat@3.3.1：family=code-plugin、channel=community、isOfficial=false、runtimeId=openclaw-weixin。描述为社区维护的 iLink 渠道插件，可能与官方插件占用同一 runtimeId，不能默认并装。

该响应未提供可确认的发布页 permalink 或源码 URL，因此这里只保留准确标识，**不构造链接**。npm view openclaw-wechat 返回 404，ClawHub 包名不能直接当作 npm 包名使用。

### 自有发布的核查范围

ClawHub skills 搜索 BigStrongSun / selfheal 以及限定 clawhub.ai 的网页搜索未发现我们的对应发布。只能说本次未发现，不能证明从未发布。本仓库的 GitHub 私有归档也不等于 ClawHub 发布。

## D. 我们的仓库、补丁和公开技术讨论

- fork：https://github.com/BigStrongSun/openclaw-weixin
- 独立自愈补丁仓库：https://github.com/BigStrongSun/openclaw-weixin-session-selfheal
- 中文设计文档：https://github.com/BigStrongSun/openclaw-weixin-session-selfheal/blob/main/README.md
- 公开补丁文件：https://github.com/BigStrongSun/openclaw-weixin-session-selfheal/blob/main/patches/weixin-session-selfheal-2.4.9.patch
- 发送成功日志 PR #328：https://github.com/Tencent/openclaw-weixin/pull/328
- stale-token 回退 PR #331：https://github.com/Tencent/openclaw-weixin/pull/331
- 会话自愈 PR #335：https://github.com/Tencent/openclaw-weixin/pull/335

三个 PR 是我们可确认的公开技术讨论/帖子入口，状态快照均为 OPEN。对应正文、base/head SHA 和 check 字段见 references/pr-*.json。

第三方社区讨论另有：

- https://www.v2ex.com/t/1211178 ：OpenClaw 微信消息通知偶发失败。网页 HTTP 200，已读正文；用户描述长期未主动联系 bot 后通知偶发收不到，并怀疑 context token。只作为现象线索，不是根因或修复有效的证明。
- https://global.v2ex.co/t/1200122 ：微信官方 openclaw 插件配置不同 agent 的方法。保留为社区配置线索，本库不将该帖方案当作当前版本已验证的官方操作。

## D.1 可选第三方 SDK（不是官方推荐）

- https://github.com/corespeed-io/wechatbot · https://www.npmjs.com/package/@wechatbot/wechatbot ：第三方 iLink SDK，GitHub/README/npm 元数据核实，npm 查得 2.2.0；多语言支持是项目声明，未运行其测试。
- https://github.com/the-yex/wechat-ilink-sdk ：第三方 Go SDK，GitHub/README 核实。即使自称 Official WeChat Bot SDK，也未查得腾讯背书；不采信“零封号风险”等保证。

这些资料用于参考已有实现，不改变本库采用官方渠道插件为底座的分类，也没有安装替换。

## E. 自有私有项目中的关联文档

- Jev 微信源码研究参考：https://github.com/BigStrongSun/jev-research/blob/main/jev-references/26-openclaw-weixin-src.md
- ACPs 公众号资料库：https://github.com/BigStrongSun/ACPs-Agent-Adapter/tree/main/docs/research/acps-wechat-source-library
- ACPs 公众号文章目录：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/CATALOG.md
- ACPs 公众号机器索引：https://github.com/BigStrongSun/ACPs-Agent-Adapter/blob/main/docs/research/acps-wechat-source-library/manifest.json
- ACPsClaw 工程：https://github.com/BigStrongSun/ACPsClaw

这些是当前账号可访问的私有资源，不适合转贴到公开 issue 或公开 README。资料库里的公众号文章与微信消息机器人属于不同主题；具体判断见 [私有仓库核查说明](private-repositories.md)。

## 核验记录与未覆盖范围

GitHub 仓库、协议文件和 OpenClaw 文档入口的核验记录保存在 [canonical-links.json](../references/canonical-links.json)；ClawHub 注册表、npm 元数据、补充官方文档与社区链接记录保存在 [ecosystem-audit.json](../references/ecosystem-audit.json)。记忆语义搜索因 fts-only / qwen3-vl-embedding-2b-local 的索引模型不匹配暂停；本次以 GitHub、实际文件和定点内容核查补足，不把不可用的记忆搜索当作完整历史检索。外部 Web Search provider 曾失败，不能保证穷尽所有第三方帖子。
