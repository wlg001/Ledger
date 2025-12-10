import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('获取记录失败:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          type,
        }),
      });
      const newRecord = await response.json();
      setRecords([...records, newRecord]);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('创建记录失败:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });
      setRecords(records.filter(r => r.id !== id));
    } catch (error) {
      console.error('删除记录失败:', error);
    }
  };

  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const balance = totalIncome - totalExpense;

  return (
    <div className="app">
      <h1>记账</h1>
      
      <div className="summary">
        <div className="summary-item">
          <span>收入</span>
          <span className="income">+{totalIncome.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>支出</span>
          <span className="expense">-{totalExpense.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>余额</span>
          <span className={balance >= 0 ? 'income' : 'expense'}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="number"
          step="0.01"
          placeholder="金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="说明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="select"
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
        <button type="submit" className="button">添加</button>
      </form>

      <div className="records">
        {records.map(record => (
          <div key={record.id} className="record">
            <div className="record-info">
              <span className={`record-type ${record.type}`}>
                {record.type === 'income' ? '收入' : '支出'}
              </span>
              <span className="record-description">{record.description}</span>
              <span className={`record-amount ${record.type}`}>
                {record.type === 'income' ? '+' : '-'}{record.amount.toFixed(2)}
              </span>
            </div>
            <div className="record-meta">
              <span className="record-date">{record.date}</span>
              <button
                onClick={() => handleDelete(record.id)}
                className="delete-button"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

