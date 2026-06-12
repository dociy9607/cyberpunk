# Spec: 登录与账号后台

## Requirements

### Requirement: 账号密码登录

系统 SHALL 支持通过账号和密码登录。

#### Scenario: 管理员登录成功

- GIVEN 存在管理员账号 `admin`
- WHEN 用户提交正确密码
- THEN 系统返回登录成功
- AND 设置 30 天有效的 HTTP-only Cookie

### Requirement: 30 天免登录

系统 SHALL 使用服务端签名 Cookie 维持登录状态，默认有效期为 30 天。

#### Scenario: 刷新页面仍然登录

- GIVEN 用户已成功登录
- WHEN 用户在 30 天内刷新网页
- THEN 系统通过 `/api/session` 识别用户身份

### Requirement: 管理员可管理账号

系统 SHALL 允许管理员查看、新增、删除账号。

#### Scenario: 管理员查看账号列表

- GIVEN 用户以管理员身份登录
- WHEN 用户打开账号后台
- THEN 系统从 `/api/accounts` 返回账号列表

### Requirement: 账号数据持久化

系统 SHALL 使用 Upstash Redis 保存账号数据，避免 Serverless 内存重启后丢失。

#### Scenario: 健康检查确认持久化

- GIVEN Vercel 已连接 Upstash Redis 环境变量
- WHEN 请求 `/api/health`
- THEN 返回 `persistentAccountStore: true`
- AND `auth.persistent` 为 `true`

### Requirement: 默认管理员账号可恢复

系统 SHALL 在数据库为空时创建默认管理员账号。

#### Scenario: 首次初始化账号

- GIVEN Redis 中不存在账号列表
- WHEN 有登录或账号读取请求触发账号加载
- THEN 系统创建默认 `admin` 账号
