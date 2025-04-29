import React, { useState, useEffect } from "react";

export default function AddEditModal({ open, onClose, onSave, initialData, fields, title }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium">{f.label}</label>
              <input
                type={f.type}
                value={form[f.name] || ""}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-green-200"
                required={f.required}
              />
            </div>
          ))}
          <div className="flex space-x-2 mt-6">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Save</button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
