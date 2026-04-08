import React from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDeleteExpense }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="expense-list">
      <h2>All Expenses</h2>
      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses added yet</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>
                    <span className={`category-badge ${expense.category.toLowerCase()}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td>{expense.description || '-'}</td>
                  <td className="amount">{formatAmount(expense.amount)}</td>
                  <td>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
