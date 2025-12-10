# 记账应用

一个极简的前后端分离记账web应用。

## 技术栈

- 后端: FastAPI
- 前端: React

## 快速开始

### 后端启动

```bash
cd backend
# 创建虚拟环境（如果还没有创建）
python3 -m venv venv

# 激活虚拟环境
# Linux/Mac:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn main:app --reload
```

后端将在 http://localhost:8000 启动

### 前端启动

```bash
cd frontend
npm install
npm start
```

前端将在 http://localhost:3000 启动

## 功能

- 查看所有收支记录
- 添加收入和支出记录
- 删除记录
- 统计总收入、总支出和余额

