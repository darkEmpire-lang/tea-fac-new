import React from 'react';

const BudgetList = ({ budgets, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Budget</th>
            <th className="px-4 py-2 text-left">Spent</th>
            <th className="px-4 py-2 text-left">Remaining</th>
            <th className="px-4 py-2 text-left">Progress</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(budget => {
            const percent = budget.amount ? (budget.spent / budget.amount) * 100 : 0;
            return (
              <tr key={budget._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{budget.category}</td>
                <td className="px-4 py-2">${Number(budget.amount).toLocaleString()}</td>
                <td className="px-4 py-2">${Number(budget.spent).toLocaleString()}</td>
                <td className="px-4 py-2">${(budget.amount - budget.spent).toLocaleString()}</td>
                <td className="px-4 py-2 w-48">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`${percent > 100 ? 'bg-red-500' : 'bg-green-500'} h-4 rounded-full`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    ></div>
                  </div>
                  {percent > 100 && (
                    <p className="text-red-600 text-xs mt-1">Budget Exceeded!</p>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onDelete(budget._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetList;
