# 补丁矩阵

## 自愈补丁的两个版本

| 文件 | 来源 | 冷却 | 状态 |
|---|---|---|---|
| [公开 60s](selfheal/weixin-session-selfheal-2.4.9-published-60s.patch) | BigStrongSun/openclaw-weixin-session-selfheal，提交 3aab7d5 | 60,000 ms | 原公开仓库已提交版本的逐字快照 |
| [本地 15m](selfheal/weixin-session-selfheal-2.4.9-local-15m.patch) | 同项目未提交工作树 | 900,000 ms | 本次单独归档的运维变体，不冒充上游已发布版本 |

两者都面向 @tencent-weixin/openclaw-weixin **2.4.9**。本地两版本差异只有 RECOVERY_COOLDOWN_MS 一行；归档验证器会再次检查。原 README 原样保存在 [README.original.md](selfheal/README.original.md)，其中 60s 表述仅对应公开版本，不对应 15m 变体。原项目的 MIT 许可证保存在 [LICENSE](selfheal/LICENSE)。

## 上游 PR 的独立 diff

| PR | diff | 用途 | 截至 2026-10-28 |
|---|---|---|---|
| [#328](https://github.com/Tencent/openclaw-weixin/pull/328) | [pr-328.diff](upstream-prs/pr-328.diff) | INFO 成功发送日志，含服务端 message_id | OPEN |
| [#331](https://github.com/Tencent/openclaw-weixin/pull/331) | [pr-331.diff](upstream-prs/pr-331.diff) | stale context_token 回退 | OPEN |
| [#335](https://github.com/Tencent/openclaw-weixin/pull/335) | [pr-335.diff](upstream-prs/pr-335.diff) | 回退 + 会话恢复 + 长轮询网络故障检测 | OPEN |

具体 base/head SHA、正文和 CI 字段保存在 [references/](../references/)。三个 diff 存在逻辑重叠，特别是 #331 与 #335；**不要顺序叠加全部应用**。PR diff 的基线以各自 baseRefOid 为准，不保证兼容任意 2.4.9 / 2.4.10 安装产物。

## 本次验证做了什么

检查文件来自指定源、两个冷却版本差异、diff 可被 git apply --numstat 解析、构建快照 JavaScript 语法。没有在运行中的插件上执行 patch，没有 reload，没有发送微信测试消息，也没有重新跑 PR 作者当年的完整测试。
