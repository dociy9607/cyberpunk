# Spec: 钱大少养胃记录

## Requirements

### Requirement: 支持记录吃饭、排泄、呕吐、睡觉

系统 SHALL 支持记录宠物的吃饭、排泄、呕吐和睡觉信息。

#### Scenario: 新增吃饭记录

- GIVEN 用户打开养胃记录
- WHEN 用户选择吃饭并保存
- THEN 系统保存一条吃饭记录
- AND 默认时间为当前时间，可手动修改

### Requirement: 自动判断早中晚餐

系统 SHALL 根据吃饭时间自动判断早餐、午餐或晚餐。

#### Scenario: 早餐判断

- GIVEN 用户录入一条上午时间的吃饭记录
- WHEN 系统保存记录
- THEN 该记录被归类为早餐

### Requirement: 日历展示当天状态

系统 SHALL 在日历中展示每天是否吃满三餐、是否正常排泄、是否呕吐。

#### Scenario: 查看某天摘要

- GIVEN 某天存在记录
- WHEN 用户查看右侧日历
- THEN 系统用状态标记展示三餐、排泄和呕吐情况

### Requirement: 点击日历查看当天记录

系统 SHALL 允许用户点击日历日期查看当天详细记录。

#### Scenario: 打开当天详情

- GIVEN 日历上某天有记录
- WHEN 用户点击该日期
- THEN 系统展示当天记录列表

### Requirement: 本地导入导出

系统 SHALL 支持将养胃记录导出为文件，并从文件导入。

#### Scenario: 导出记录

- GIVEN 当前浏览器存在养胃记录
- WHEN 用户点击导出
- THEN 系统下载记录文件

## Known Limitation

养胃记录当前保存在浏览器 `localStorage`，还没有接入 Upstash Redis。它适合单设备使用，但不适合多设备同步。
