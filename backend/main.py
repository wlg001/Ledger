from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
import json
import os

app = FastAPI(title="记账应用API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据文件路径
DATA_FILE = "records.json"

class Record(BaseModel):
    id: int
    amount: float
    description: str
    date: str
    type: str  # "income" 或 "expense"

class RecordCreate(BaseModel):
    amount: float
    description: str
    type: str

def load_records() -> List[dict]:
    """加载记录"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_records(records: List[dict]):
    """保存记录"""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

@app.get("/")
def read_root():
    return {"message": "记账API"}

@app.get("/api/records", response_model=List[Record])
def get_records():
    """获取所有记录"""
    records = load_records()
    return records

@app.post("/api/records", response_model=Record)
def create_record(record: RecordCreate):
    """创建新记录"""
    records = load_records()
    new_id = max([r.get("id", 0) for r in records], default=0) + 1
    new_record = {
        "id": new_id,
        "amount": record.amount,
        "description": record.description,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": record.type
    }
    records.append(new_record)
    save_records(records)
    return new_record

@app.delete("/api/records/{record_id}")
def delete_record(record_id: int):
    """删除记录"""
    records = load_records()
    filtered_records = [r for r in records if r.get("id") != record_id]
    if len(filtered_records) == len(records):
        raise HTTPException(status_code=404, detail="记录不存在")
    save_records(filtered_records)
    return {"message": "删除成功"}

