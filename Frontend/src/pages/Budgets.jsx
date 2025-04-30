import React, { useEffect, useState, useRef } from "react";
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getExpenses,
} from "../api/api";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
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
import html2canvas from "html2canvas";
import download from "downloadjs";
import teaLogo from "../assets/teatfac.png";
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
  return Number(amount).toLocaleString();
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

// PNG report for only present categories
const BudgetPNGReport = React.forwardRef(
  ({ trackedBudgets, date }, ref) => (
    <div
      ref={ref}
      style={{
        width: 700,
        background: "#fbfbfb",
        borderRadius: 24,
        boxShadow: "0 8px 32px rgba(32,77,42,0.10)",
        border: "3px solid #2e865f",
        padding: 0,
        overflow: "hidden",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#204d2a",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg,#17612d 0%,#2e865f 100%)",
          padding: "32px 0 20px 0",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            margin: "0 auto 12px auto",
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(46,134,95,0.13)",
            border: "4px solid #e6f9ed",
          }}
        >
          <img
            src={teaLogo}
            alt="Logo"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 28,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          Newlands Tea Factory
        </div>
        <div
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: "#e6f9ed",
            marginTop: 4,
            letterSpacing: 0.5,
          }}
        >
          Budget Report
        </div>
      </div>
      <div style={{ padding: "36px 32px 24px 32px" }}>
        <table style={{ width: "100%", fontSize: 17, marginBottom: 18 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 0", color: "#17612d" }}>Category</th>
              <th style={{ textAlign: "right", padding: "10px 0", color: "#17612d" }}>Budget</th>
              <th style={{ textAlign: "right", padding: "10px 0", color: "#17612d" }}>Spent</th>
              <th style={{ textAlign: "right", padding: "10px 0", color: "#17612d" }}>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {trackedBudgets
              .filter(b => b.amount > 0 || b.spent > 0)
              .map(b => (
                <tr key={b.category}>
                  <td style={{ padding: "9px 0", fontWeight: 500 }}>{b.category}</td>
                  <td style={{ padding: "9px 0", textAlign: "right", fontWeight: 600 }}>
                    LKR{formatMoney(b.amount)}
                  </td>
                  <td style={{ padding: "9px 0", textAlign: "right", fontWeight: 600 }}>
                    LKR{formatMoney(b.spent)}
                  </td>
                  <td style={{ padding: "9px 0", textAlign: "right", fontWeight: 600 }}>
                    LKR{formatMoney(b.amount - b.spent)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div
          style={{
            background: "#e6f9ed",
            borderRadius: 12,
            padding: "18px 20px",
            margin: "18px 0",
            fontSize: 16,
            color: "#17612d",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          <span>
            This report summarizes all budget allocations for Newlands Tea Factory.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 28,
            fontSize: 15,
            color: "#64748b",
          }}
        >
          <span>
            <b>Generated by:</b> Financial Admin
          </span>
          <span>
            <b>Date:</b> {date}
          </span>
        </div>
      </div>
      <div
        style={{
          background: "#17612d",
          color: "#e6f9ed",
          padding: "14px 0",
          textAlign: "center",
          fontSize: 14,
          borderRadius: "0 0 20px 20px",
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        &copy; {new Date().getFullYear()} Newlands Tea Factory &mdash; All rights reserved.
      </div>
    </div>
  )
);

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
  const pngRef = useRef();

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

  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });

  // PNG Download handler
  const handleDownloadPNG = async () => {
    if (!pngRef.current) return;
    setTimeout(async () => {
      const canvas = await html2canvas(pngRef.current, {
        backgroundColor: "#fbfbfb",
        scale: 3,
        useCORS: true,
      });
      const dataURL = canvas.toDataURL("image/png");
      download(dataURL, `budget_report_${todayStr.replace(/\s/g, "_")}.png`, "image/png");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-8">
      {/* Export Report PNG */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <BudgetPNGReport
          ref={pngRef}
          trackedBudgets={trackedBudgets}
          date={todayStr}
        />
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 mb-6 px-4 sm:px-8"
      >
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Total Budget</div>
          <div className="text-3xl font-bold text-[#204d2a]">LKR{formatMoney(totalBudget)}</div>
          <div className="text-xs text-gray-400 mt-1">FY {new Date().getFullYear()}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Spent</div>
          <div className="text-3xl font-bold text-green-600">LKR{formatMoney(totalSpent)}</div>
          <div className="text-xs text-gray-400 mt-1">{percentSpent.toFixed(1)}% of budget</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Remaining</div>
          <div className="text-3xl font-bold text-yellow-600">LKR{formatMoney(totalRemaining)}</div>
          <div className="text-xs text-gray-400 mt-1">{percentRemaining.toFixed(1)}% remaining</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="text-gray-500 text-sm">Monthly Avg</div>
          <div className="text-3xl font-bold text-[#204d2a]">LKR{formatMoney(monthlyAvg)}</div>
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
                      Spent: LKR{formatMoney(b.spent)} / LKR{formatMoney(b.amount)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => {
                          setEditData(b);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={async () => {
                          await deleteBudget(b._id);
                          const [budRes, expRes] = await Promise.all([getBudgets(), getExpenses()]);
                          setBudgets(budRes.data);
                          setExpenses(expRes.data);
                        }}
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
                onClick={handleDownloadPNG}
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
                <td className="py-2 px-4">LKR{formatMoney(e.amount)}</td>
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
        onSave={async (data) => {
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
        }}
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
