const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let expenses = [];
let nextId = 1;

// Predefined categories
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills'];

// GET /api/expenses - Get all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// POST /api/expenses - Add new expense
app.post('/api/expenses', (req, res) => {
  const { amount, category, description, date } = req.body;

  // Validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  if (!category || !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const expense = {
    id: nextId++,
    amount: parseFloat(amount),
    category,
    description: description || '',
    date: date || new Date().toISOString()
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

// DELETE /api/expenses/:id - Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  expenses.splice(index, 1);
  res.status(204).send();
});

// GET /api/expenses/summary - Get monthly summary
app.get('/api/expenses/summary', (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter expenses for current month
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth &&
           expenseDate.getFullYear() === currentYear;
  });

  // Calculate total
  const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate category breakdown
  const byCategory = {};
  CATEGORIES.forEach(cat => {
    byCategory[cat] = 0;
  });

  monthlyExpenses.forEach(expense => {
    byCategory[expense.category] += expense.amount;
  });

  res.json({
    total,
    byCategory,
    count: monthlyExpenses.length
  });
});

// GET /api/categories - Get available categories
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
