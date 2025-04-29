import React from "react";

export default function BudgetTable({ budgets, onEdit, onDelete, onNotify }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <h4 className="font-semibold mb-2">Budgets</h4>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Budget</th>
            <th className="py-2 px-4">Spent</th>
            <th className="py-2 px-4">Remaining</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => {
            const remaining = b.amount - b.spent;
            const exceeded = remaining < 0;
            return (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{b.category}</td>
                <td className="py-2 px-4">${b.amount}</td>
                <td className="py-2 px-4">${b.spent}</td>
                <td className={`py-2 px-4 ${exceeded ? "text-red-500" : "text-green-600"}`}>${remaining}</td>
                <td className="py-2 px-4">
                  {exceeded ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Exceeded</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Within</span>
                  )}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button onClick={() => onEdit(b)} className="text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => onDelete(b._id)} className="text-red-500 hover:underline">Delete</button>
                  {exceeded && <button onClick={() => onNotify(b)} className="text-orange-500 hover:underline">Notify</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
