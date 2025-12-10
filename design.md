# 记账应用设计文档

## 项目概述

这是一个极简的前后端分离记账web应用，采用FastAPI作为后端，React作为前端。

## 技术架构

### 后端
- **框架**: FastAPI
- **数据存储**: JSON文件（records.json）
- **API端口**: 8000

### 前端
- **框架**: React
- **开发端口**: 3000
- **构建工具**: Create React App

## 功能设计

### 核心功能
1. **查看记录**: 显示所有收支记录
2. **添加记录**: 支持添加收入和支出记录
3. **删除记录**: 删除指定记录
4. **统计汇总**: 显示总收入、总支出和余额

### 数据模型

#### Record（记录）
- `id`: 唯一标识符（整数）
- `amount`: 金额（浮点数）
- `description`: 说明（字符串）
- `date`: 日期时间（字符串，格式：YYYY-MM-DD HH:MM:SS）
- `type`: 类型（字符串，"income" 或 "expense"）

## API设计

### GET /api/records
获取所有记录

**响应**: `List[Record]`

### POST /api/records
创建新记录

**请求体**:
```json
{
  "amount": 100.0,
  "description": "午餐",
  "type": "expense"
}
```

**响应**: `Record`

### DELETE /api/records/{record_id}
删除指定记录

**响应**: `{"message": "删除成功"}`

## 界面设计

### 布局
- 顶部：标题"记账"
- 统计区：收入、支出、余额（横向排列）
- 表单区：金额输入、说明输入、类型选择、添加按钮
- 记录列表：显示所有记录，每条记录包含类型、说明、金额、日期和删除按钮

### 样式特点
- 极简设计，白色背景卡片
- 收入用绿色显示，支出用红色显示
- 响应式布局，最大宽度600px居中显示

## 数据持久化

使用JSON文件（records.json）存储数据，位于后端目录。

## 开发说明

- 后端启动：`cd backend && uvicorn main:app --reload`
- 前端启动：`cd frontend && npm start`
- 前端需要配置proxy指向后端API（http://localhost:8000）

