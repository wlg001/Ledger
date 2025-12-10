import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [platform, setPlatform] = useState('其它');

  // 预置常用消费项目
  const commonExpenses = [
    '早餐', '午餐', '晚餐', '零食',
    '公交', '地铁', '打车', '加油',
    '日用品', '衣服', '电子产品',
    '电影', '游戏', 'KTV',
    '看病', '买药',
    '培训', '书籍'
  ];

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

    // 将平台信息添加到说明中
    const fullDescription = platform !== '其它' ? `${platform} - ${description}` : description;

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: fullDescription,
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

  const handleSelectExpense = (expense) => {
    setDescription(expense);
    setType('expense');
  };

  const handleNumberInput = (num) => {
    if (num === '.' && amount.includes('.')) return; // 防止多个小数点
    if (num === '.' && amount === '') {
      setAmount('0.');
      return;
    }
    setAmount(amount + num);
  };

  const handleBackspace = () => {
    setAmount(amount.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleConfirm = async () => {
    if (!amount || !description) return;

    // 将平台信息添加到说明中
    const fullDescription = platform !== '其它' ? `${platform} - ${description}` : description;

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: fullDescription,
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
        <div className="amount-platform-container">
          <div className="amount-display-left">
            <span className="amount-label">金额：</span>
            <span className="amount-value">{amount || '0.00'}</span>
          </div>
          <div className="amount-input-center">
            <span className="amount-display-text">{amount || '0.00'}</span>
          </div>
          <div className="platform-selector-right">
            <button
              type="button"
              onClick={() => setPlatform('拼多多')}
              className={`platform-button ${platform === '拼多多' ? 'active' : ''}`}
            >
              拼多多
            </button>
            <button
              type="button"
              onClick={() => setPlatform('京东')}
              className={`platform-button ${platform === '京东' ? 'active' : ''}`}
            >
              京东
            </button>
            <button
              type="button"
              onClick={() => setPlatform('淘宝')}
              className={`platform-button ${platform === '淘宝' ? 'active' : ''}`}
            >
              淘宝
            </button>
            <button
              type="button"
              onClick={() => setPlatform('其它')}
              className={`platform-button ${platform === '其它' ? 'active' : ''}`}
            >
              其它
            </button>
          </div>
        </div>
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

      <div className="expense-categories">
        <h3>常用消费</h3>
        <div className="expense-grid">
          {commonExpenses.map(expense => (
            <button
              key={expense}
              type="button"
              onClick={() => handleSelectExpense(expense)}
              className="expense-item"
            >
              {expense}
            </button>
          ))}
        </div>
      </div>

      <div className="number-keyboard">
        <div className="keyboard-left">
          <div className="type-selector">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`type-button ${type === 'expense' ? 'active expense' : ''}`}
            >
              支出
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`type-button ${type === 'income' ? 'active income' : ''}`}
            >
              收入
            </button>
          </div>
        </div>
        
        <div className="keyboard-center">
          <div className="number-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberInput(num.toString())}
                className="number-key"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNumberInput('.')}
              className="number-key"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="number-key"
            >
              ⌫
            </button>
          </div>
        </div>

        <div className="keyboard-right">
          <button
            type="button"
            onClick={handleBackspace}
            className="action-button minus"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="action-button plus"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="action-button confirm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

