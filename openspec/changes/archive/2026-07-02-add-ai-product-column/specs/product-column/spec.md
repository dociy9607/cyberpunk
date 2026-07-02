# Delta for 产品专栏

## ADDED Requirements

### Requirement: 提供产品专栏入口

系统 SHALL 在 dehviz.lol 中提供产品专栏能力，用于展示每日 AI 产品动态报告、GitHub 项目观察、AI 产品功能更新和大湾区 AI 活动。

#### Scenario: 打开产品专栏
- GIVEN 用户进入网站
- WHEN 用户打开产品专栏入口
- THEN 系统展示产品专栏首页或最新日报
- AND 用户可以查看历史日期报告

### Requirement: 保存每日 AI 产品报告

系统 SHALL 以日期为单位保存每日 AI 产品动态报告，并保留历史报告。

#### Scenario: 新增每日报告
- GIVEN 自动化生成某日 AI 产品动态报告
- WHEN 系统更新产品专栏
- THEN 系统保存该日期的 Markdown 报告
- AND 报告文件名使用日期格式，例如 `2026-07-02.md`
- AND 旧日期报告不得被删除或覆盖

### Requirement: 报告包含固定内容板块

系统 SHALL 将每日 AI 产品动态报告组织为固定板块，便于长期阅读和比较。

#### Scenario: 查看完整报告
- GIVEN 用户打开某日产品报告
- WHEN 页面展示报告内容
- THEN 报告包含 GitHub 专区、值得关注的产品/功能、大湾区 AI 活动、今日最值得借鉴的产品
- AND 页面提供锚点目录

### Requirement: GitHub 专区收集开源项目

系统 SHALL 在 GitHub 专区展示最近 7 天内星数增长显著或新发布即获关注的开源项目。

#### Scenario: 展示 GitHub 项目
- GIVEN 每日报告包含 GitHub 专区
- WHEN 用户查看项目条目
- THEN 每条包含项目名称、一句话简介、语言或框架、当前 Star 数及近期增长趋势、产品化理由和 GitHub 链接

### Requirement: AI 产品功能条目需要交叉验证

系统 SHALL 对值得关注的 AI 产品或功能条目进行交叉验证，避免收录无法确认真实性的信息。

#### Scenario: 收录 AI 产品功能
- GIVEN 自动化候选产品功能条目
- WHEN 条目进入正式报告
- THEN 条目至少有两个独立来源确认核心事实一致
- AND 条目包含产品名称、一句话简介、产品亮点、当前阶段、可信度打分、交叉验证说明和来源链接
- AND 无法交叉验证的条目不得计入正式 15 条列表

### Requirement: 可信度评分

系统 SHALL 为 AI 产品功能条目标注可信度评分，并说明依据。

#### Scenario: 标注可信度
- GIVEN 一条 AI 产品功能进入报告
- WHEN 系统生成条目
- THEN 系统按 1 到 5 分标注可信度
- AND 1 分条目不得进入正式入选列表
- AND 缺少信息时写明“暂未查到”，不得猜测填补

### Requirement: 大湾区 AI 活动只收录未来活动

系统 SHALL 在大湾区 AI 活动板块展示活动日期在报告日期之后的展演、开发者大会、线下沙龙或 Meetup。

#### Scenario: 展示活动条目
- GIVEN 报告日期为当天
- WHEN 系统收录大湾区 AI 活动
- THEN 每条包含活动名称、时间地点、活动类型、报名或详情链接和一句话简介
- AND 活动日期早于报告日期的条目不得收录

### Requirement: 今日最值得借鉴的产品

系统 SHALL 从正式 AI 产品功能条目中选出一个最值得借鉴的产品，并提供产品经理或创业者视角的分析。

#### Scenario: 展示每日借鉴产品
- GIVEN 报告包含正式 AI 产品功能条目
- WHEN 用户查看今日最值得借鉴的产品
- THEN 系统展示产品名称和 3 到 5 句入选理由
- AND 分析覆盖交互、商业模式、技术应用或增长策略中的至少一个角度

### Requirement: 去重清单

系统 SHALL 维护已报道清单，避免每日产品专栏重复收录相同产品或项目。

#### Scenario: 运行前去重
- GIVEN 自动化准备生成新报告
- WHEN 系统读取 `data/daily_ai_reported.json`
- THEN 已报道的产品或项目被跳过
- AND 报告完成后，当日新增条目追加到已报道清单

### Requirement: 高亮订阅能力

系统 SHOULD 在产品专栏中提供高亮功能，使用户可以标记值得持续关注的产品或项目。

#### Scenario: 高亮条目
- GIVEN 用户查看产品专栏条目
- WHEN 用户打开某条产品或项目的高亮开关
- THEN 系统保存该条目的高亮状态
- AND 高亮日历显示对应日期的高亮数量
- AND 用户可以手动取消高亮

### Requirement: 每日自动化计划

系统 SHALL 支持每天上午 9:00 自动执行 AI 产品情报更新流程。

#### Scenario: 自动化每日运行
- GIVEN 每日自动化任务处于 ACTIVE
- WHEN 到达北京时间上午 9:00
- THEN 自动化执行检索、交叉验证、去重比对、生成报告、更新网站、构建检查和提交推送
- AND 运行结果记录日期、条数、验证结果、commit hash、push 结果和线上检查结果

### Requirement: 构建验证

系统 SHALL 在产品专栏内容更新后执行项目验证。

#### Scenario: 更新后验证
- GIVEN 产品专栏内容已更新
- WHEN 自动化准备提交
- THEN 系统运行 `npm run typecheck` 和 `npm run build`
- AND 验证失败时应修复后重试，不能直接推送失败状态

