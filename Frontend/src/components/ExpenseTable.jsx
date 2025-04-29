import React from "react";

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <h4 className="font-semibold mb-2">Expense Records</h4>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-gray-50">
              <td className="py-2 px-4">{expense.date}</td>
              <td className="py-2 px-4">{expense.category}</td>
              <td className="py-2 px-4">{expense.description}</td>
              <td className="py-2 px-4">${expense.amount}</td>
              <td className="py-2 px-4 space-x-2">
                <button onClick={() => onEdit(expense)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => onDelete(expense._id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
