import React, { useState } from 'react';

const budgetCategories = [
  'Equipment Maintenance',
  'Raw Materials',
  'Transport',
  'Utilities',
  'Other',
];

const BudgetForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ category: '', amount: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.category || !form.amount) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(form);
    setForm({ category: '', amount: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">Select Category</option>
          {budgetCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Budget Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter budget amount"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Set Budget
      </button>
    </form>
  );
};

export default BudgetForm;
