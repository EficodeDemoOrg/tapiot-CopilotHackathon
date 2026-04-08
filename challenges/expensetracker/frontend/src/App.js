import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: {}, count: 0 });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/summary`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      if (response.ok) {
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      if (response.ok || response.status === 204) {
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Expense Tracker</h1>
      </header>
      <div className="container">
        <div className="main-content">
          <div className="form-section">
            <ExpenseForm
              onAddExpense={handleAddExpense}
              categories={categories}
            />
          </div>
          <div className="summary-section">
            <ExpenseSummary summary={summary} />
          </div>
        </div>
        <div className="list-section">
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
