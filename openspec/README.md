# OpenSpec 使用说明

这个目录用来记录 `dehviz.lol` 的当前系统规格和后续需求变更。

## 怎么提新需求

你可以直接这样说：

```text
用 OpenSpec 给 dehviz.lol 加一个新需求：把养胃记录改成云端保存，手机和电脑都能同步。要求保留现在的日历和导入导出功能。
```

我会先创建：

- `openspec/changes/<change-name>/proposal.md`
- `openspec/changes/<change-name>/design.md`
- `openspec/changes/<change-name>/tasks.md`
- `openspec/changes/<change-name>/specs/<capability>/spec.md`

你确认后，我再改代码、验证、推送、部署。

## 当前规格

- `specs/workbench/spec.md`：首页和卡片式工作台
- `specs/auth/spec.md`：登录、免登录和账号后台
- `specs/health-log/spec.md`：钱大少养胃记录
- `specs/commerce-news/spec.md`：每日跨境电商资讯
- `specs/operations/spec.md`：GitHub、Vercel、数据库、部署流程
