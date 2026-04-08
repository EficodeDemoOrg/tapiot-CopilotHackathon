import React from 'react';
import './ExpenseSummary.css';

function ExpenseSummary({ summary }) {
  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getCategoryPercentage = (amount) => {
    if (summary.total === 0) return 0;
    return ((amount / summary.total) * 100).toFixed(1);
  };

  return (
    <div className="expense-summary">
      <h2>Monthly Summary</h2>

      <div className="total-section">
        <div className="total-label">Total Spending</div>
        <div className="total-amount">{formatAmount(summary.total)}</div>
        <div className="total-count">{summary.count} expenses</div>
      </div>

      <div className="category-breakdown">
        <h3>By Category</h3>
        {Object.entries(summary.byCategory || {}).map(([category, amount]) => (
          <div key={category} className="category-item">
            <div className="category-header">
              <span className="category-name">{category}</span>
              <span className="category-amount">{formatAmount(amount)}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getCategoryPercentage(amount)}%` }}
              ></div>
            </div>
            <div className="category-percentage">
              {getCategoryPercentage(amount)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseSummary;
