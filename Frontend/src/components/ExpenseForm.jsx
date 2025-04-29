import React, { useState } from 'react';

const expenseCategories = [
  'Equipment Maintenance',
  'Raw Materials',
  'Transport',
  'Utilities',
  'Other',
];

const ExpenseForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ category: '', amount: '', date: '', description: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.date) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(form);
    setForm({ category: '', amount: '', date: '', description: '' });
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
          {expenseCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter amount"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Optional description"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
