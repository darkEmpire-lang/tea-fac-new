import React, { useEffect, useState } from "react";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getExpenses,
} from "../api/api";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button, Badge } from "@chakra-ui/react";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CATEGORIES = [
  "Electricity Bill",
  "Water Bill",
  "Machinery Maintenance",
  "Raw Materials",
  "Packaging",
  "Transportation",
  "Employee Salaries",
  "Welfare",
  "Marketing",
  "Office Supplies",
  "Factory Rent",
  "Security",
  "Cleaning",
  "Insurance",
  "Miscellaneous",
];

function formatMoney(amount) {
  return amount.toLocaleString();
}

function getMonthAvg(expenses) {
  if (!expenses.length) return 0;
  const months = new Set(
    expenses.map((e) => {
      const d = new Date(e.date);
      return `${d.getFullYear()}-${d.getMonth()}`;
    })
  );
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  return Math.round(total / months.size);
}

// BEAUTIFUL, RESPONSIVE, LIGHT MODAL
function BudgetModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    category: "",
    amount: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || "",
        amount: initialData.amount || "",
      });
    } else {
      setForm({ category: "", amount: "" });
    }
    setError("");
  }, [initialData, open]);

  const validate = () => {
    if (!form.category) return "Category is required";
    if (!form.amount) return "Amount is required";
    if (isNaN(form.amount) || Number(form.amount) <= 0)
      return "Amount must be a positive number";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onSave({
      ...form,
      amount: Number(form.amount),
    });
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md border border-green-200 animate-fadeIn">
        <h2 className="text-xl font-bold mb-6 text-[#204d2a] text-center">
          {initialData ? "Edit Budget" : "Add Budget"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option value={cat} key={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              min={1}
              pattern="[0-9]*"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              colorScheme="green"
              type="submit"
              className="w-full sm:w-auto"
            >
              {initialData ? "Update" : "Add"} Budget
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <style>{`
        .animate-fadeIn {
          animation: fadeInModal 0.3s;
        }
        @keyframes fadeInModal {
          0% { opacity: 0; transform: scale(0.97);}
          100% { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const [budRes, expRes] = await Promise.all([getBudgets(), getExpenses()]);
      setBudgets(budRes.data);
      setExpenses(expRes.data);
    };
    fetchAll();
  }, []);

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => {
    const spent = expenses
      .filter(e => e.category === b.category)
      .reduce((s, e) => s + Number(e.amount), 0);
    return sum + spent;
  }, 0);
  const totalRemaining = totalBudget - totalSpent;
  const percentSpent = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
  const percentRemaining = 100 - percentSpent;
  const monthlyAvg = getMonthAvg(expenses);

  const trackedBudgets = budgets.map(b => {
    const spent = expenses
      .filter(e => e.category === b.category)
      .reduce((s, e) => s + Number(e.amount), 0);
    const percent = b.amount ? Math.round((spent / b.amount) * 100) : 0;
    return { ...b, spent, percent };
  });

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const handleSave = async (data) => {
    if (editData) {
      await updateBudget(editData._id, data);
    } else {
      await addBudget(data);
    }
    const [budRes, expRes] = await Promise.all([getBudgets(), getExpenses()]);
    setBudgets(budRes.data);
    setExpenses(expRes.data);
    setModalOpen(false);
    setEditData(null);
  };

  const handleEdit = (b) => {
    setEditData(b);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    const [budRes, expRes] = await Promise.all([getBudgets(), getExpenses()]);
    setBudgets(budRes.data);
    setExpenses(expRes.data);
  };

  const chartData = {
    labels: trackedBudgets.map(b => b.category),
    datasets: [
      {
        label: "Budget",
        data: trackedBudgets.map(b => b.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Spent",
        data: trackedBudgets.map(b => b.spent),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Budget vs Spent per Category" },
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Newlands Tea Factory Budget Report", 14, 22);
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);

    const tableColumn = ["Category", "Budget", "Spent", "Remaining"];
    const tableRows = trackedBudgets.map(b => [
      b.category,
      "$" + formatMoney(b.amount),
      "$" + formatMoney(b.spent),
      "$" + formatMoney(b.amount - b.spent),
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
      styles: { fontSize: 11 },
      headStyles: { fillColor: [32, 77, 42] },
    });

    doc.setFontSize(10);
    doc.text(
      "© " + new Date().getFullYear() + " Newlands Tea Factory. All rights reserved.",
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save("budget_report.pdf");
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-8">
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 mb-6 px-4 sm:px-8"
      >
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Total Budget</div>
          <div className="text-3xl font-bold text-[#204d2a]">${formatMoney(totalBudget)}</div>
          <div className="text-xs text-gray-400 mt-1">FY {new Date().getFullYear()}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Spent</div>
          <div className="text-3xl font-bold text-green-600">${formatMoney(totalSpent)}</div>
          <div className="text-xs text-gray-400 mt-1">{percentSpent.toFixed(1)}% of budget</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Remaining</div>
          <div className="text-3xl font-bold text-yellow-600">${formatMoney(totalRemaining)}</div>
          <div className="text-xs text-gray-400 mt-1">{percentRemaining.toFixed(1)}% remaining</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Monthly Avg</div>
          <div className="text-3xl font-bold text-[#204d2a]">${formatMoney(monthlyAvg)}</div>
          <div className="text-xs text-gray-400 mt-1">Last 12 months</div>
        </div>
      </motion.div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-8">
        {/* Budget Tracking */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="col-span-2"
        >
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
            <div className="font-bold text-[#204d2a] mb-4">Budget Tracking</div>
            {trackedBudgets.length === 0 && (
              <div className="text-gray-400">No budgets set. Add a budget to start tracking.</div>
            )}
            <AnimatePresence>
              {trackedBudgets.map(b => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-1 gap-2">
                    <span className="font-medium text-gray-700">{b.category}</span>
                    <span className={`text-sm font-bold ${b.percent >= 100 ? "text-red-600" : b.percent >= 80 ? "text-yellow-600" : "text-green-600"}`}>
                      {b.percent}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <motion.div
                      className={`h-3 rounded-full transition-all duration-300 ${b.percent >= 100 ? "bg-red-400" : b.percent >= 80 ? "bg-yellow-400" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, b.percent)}%` }}
                      layout
                    ></motion.div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-1 gap-2">
                    <span className="text-xs text-gray-500">
                      Spent: ${formatMoney(b.spent)} / ${formatMoney(b.amount)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => handleEdit(b)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => handleDelete(b._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
            <div className="font-bold text-[#204d2a] mb-4">Quick Actions</div>
            <div className="flex flex-col gap-2">
              <Button
                colorScheme="green"
                onClick={() => { setModalOpen(true); setEditData(null); }}
                className="w-full font-semibold rounded"
              >
                + Add New Budget
              </Button>
              <Button
                colorScheme="green"
                variant="outline"
                className="w-full font-semibold rounded"
                onClick={handleExport}
              >
                Export Report
              </Button>
              <Button
                colorScheme="yellow"
                variant="outline"
                className="w-full font-semibold rounded"
                onClick={() => setShowAnalytics(true)}
              >
                View Analytics
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-90 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 w-full max-w-2xl relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
                onClick={() => setShowAnalytics(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-6 text-[#204d2a]">Budget Analytics</h2>
              <div className="overflow-x-auto">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6 mx-2 sm:mx-8 overflow-x-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
          <div className="font-bold text-[#204d2a]">Recent Expenses</div>
          <Link to="/expense" className="text-green-700 font-semibold hover:underline">View All</Link>
        </div>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="bg-[#f7faf8]">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No expenses found.
                </td>
              </tr>
            )}
            {recentExpenses.map((e, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-2 px-4">{new Date(e.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{e.category}</td>
                <td className="py-2 px-4">{e.description}</td>
                <td className="py-2 px-4">${formatMoney(e.amount)}</td>
                <td className="py-2 px-4">
                  <Badge
                    colorScheme={
                      e.status === "Approved"
                        ? "green"
                        : e.status === "Pending"
                        ? "yellow"
                        : "red"
                    }
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {e.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Add/Edit Modal */}
      <BudgetModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
      />

      {/* Footer */}
      <footer className="bg-[#204d2a] text-white px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between mt-8 rounded-b-xl">
        <span className="text-sm">&copy; {new Date().getFullYear()} Newlands Tea Factory. All rights reserved.</span>
        <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
