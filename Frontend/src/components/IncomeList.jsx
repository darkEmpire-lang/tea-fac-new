import React from 'react';

const IncomeList = ({ incomes, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map(income => (
            <tr key={income._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(income.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{income.category}</td>
              <td className="px-4 py-2">{income.description}</td>
              <td className="px-4 py-2">${Number(income.amount).toLocaleString()}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(income._id)}
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

export default IncomeList;
