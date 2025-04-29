import React from "react";

export default function IncomeTable({ incomes, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <h4 className="font-semibold mb-2">Income Records</h4>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Source</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income._id} className="hover:bg-gray-50">
              <td className="py-2 px-4">{income.date}</td>
              <td className="py-2 px-4">{income.source}</td>
              <td className="py-2 px-4">${income.amount}</td>
              <td className="py-2 px-4 space-x-2">
                <button onClick={() => onEdit(income)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => onDelete(income._id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
