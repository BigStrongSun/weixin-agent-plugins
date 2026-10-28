# 来源、许可与归档约定

核查/归档日期：2026-10-28。

## 来源固定

- cross-channel-notify 0.2.0：由用户环境中已存在的自有插件文件逐字归档，没有拷贝运行配置、账户或 node_modules。SHA-256 清单见 references/files.sha256.json。
- 公开自愈补丁：来自 BigStrongSun/openclaw-weixin-session-selfheal 的提交 3aab7d5；保留原 README 与 MIT LICENSE。
- 15 分钟自愈变体：来自同项目未提交工作树；相对公开版本只改冷却常量。不回写、不提交到旧公开仓库。
- 上游 PR #328 / #331 / #335：归档 GitHub diff 及当时的结构化 metadata；head/base SHA 见对应 JSON。
- GitHub 私有项目仅引用与微信/智能体关联的文档入口。不复制凭据、完整无关仓库、公众号图片或聊天记录。

## 授权范围

本仓库保持私有。自有原创资料的归档不额外授予公开再分发许可；补丁与其他原项目的许可证分别适用。不要把根仓库整体标为 MIT，也不要从某个子目录的 LICENSE 推断整个资料库都可公开。

参考链接不代表我们拥有对应项目。第三方技能和插件未因出现在列表中就获得安全背书；安装前需单独审查代码、权限和许可证。

## 更新方式

1. 先核对原仓库分支、提交和可见性。
2. 只导入明确范围的源码/文档，不复制登录状态、数据库或日志。
3. 新增或刷新 sources/PR metadata 后更新校验清单。
4. 运行 node scripts/verify-archive.mjs，再由维护者审阅 git diff。
5. 不在这里直接执行归档插件代码或自动 reload 生产 Gateway。
