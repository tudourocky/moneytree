import React, { useState } from "react";

const ExpenseTracker = ({ expenses }) => {
  const [comments, setComments] = useState(
    expenses.reduce((acc, expense) => {
      acc[expense.category] = ""; // Initialize empty comments for each expense
      return acc;
    }, {})
  );

  // Handle comment change
  const handleCommentChange = (category, event) => {
    setComments({
      ...comments,
      [category]: event.target.value,
    });
  };

  return (
    <div className="expense-tracker">
      <h3>Expense Tracker</h3>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <div className="expense-item">
              <span>{expense.category}: </span>
              <span>${expense.amount}</span>
              <div className="expense-comment">
                <textarea
                  placeholder="Add a comment..."
                  value={comments[expense.category] || ""}
                  onChange={(e) => handleCommentChange(expense.category, e)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;