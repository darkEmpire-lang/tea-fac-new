import React from 'react';

const ExpenseList = ({ expenses, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{expense.category}</td>
              <td className="px-4 py-2">{expense.description}</td>
              <td className="px-4 py-2">${Number(expense.amount).toLocaleString()}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    expense.status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {expense.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(expense._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
