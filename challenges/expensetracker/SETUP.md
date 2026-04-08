# Expense Tracker - Setup and Running Instructions

This is a complete expense tracker application built with React frontend and Express.js backend.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd challenges/expensetracker/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will start on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd challenges/expensetracker/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Using the Application

### Features

1. **Add Expenses**: Fill in the form with amount, category, description, and date to add a new expense
2. **View Expenses**: All expenses are displayed in a table format
3. **Delete Expenses**: Click the delete button to remove an expense
4. **Monthly Summary**: View total spending for the current month
5. **Category Breakdown**: See spending distribution across categories with visual progress bars

### Available Categories

- Food
- Transport
- Entertainment
- Shopping
- Bills

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add a new expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/summary` - Get monthly summary
- `GET /api/categories` - Get available categories

## Success Criteria

✅ Can add new expenses
✅ Can view list of expenses
✅ Can see monthly total
✅ Can delete expenses
✅ Shows category breakdown
✅ Basic styling/layout

## Development Notes

- Data is stored in-memory (resets on server restart)
- Frontend runs on port 3000
- Backend runs on port 3001
- CORS is enabled for local development
