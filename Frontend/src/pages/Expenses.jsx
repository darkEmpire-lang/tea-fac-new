import React, { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../api/api";
import Swal from "sweetalert2";
import { nanoid } from "nanoid";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Button,
  Badge,
  IconButton,
  Tooltip as ChakraTooltip,
  Box,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend);

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

function ExpenseForm({ onSave, initialData, onClose }) {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
    status: "Pending",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date ? initialData.date.slice(0, 10) : "",
        description: initialData.description || "",
        status: initialData.status || "Pending",
      });
    }
  }, [initialData]);

  // Only allow numbers in amount field, block letters
  const handleAmountInput = (e) => {
    const { value } = e.target;
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setForm((prev) => ({ ...prev, amount: value }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      handleAmountInput(e);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.category) return "Category is required";
    if (!form.amount) return "Amount is required";
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(form.amount)) return "Amount must be a valid number";
    if (isNaN(form.amount) || Number(form.amount) <= 0)
      return "Amount must be a number greater than 0";
    if (!form.date) return "Date is required";
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
      expenseId: initialData?.expenseId || nanoid(8),
    });
    setForm({
      category: "",
      amount: "",
      date: "",
      description: "",
      status: "Pending",
    });
  };

  return (
    <form
      className="bg-white rounded-xl p-6 shadow flex flex-col gap-4 animate-fadeIn"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-semibold mb-2">
        {initialData ? "Edit Expense" : "Add New Expense"}
      </h3>
      <div>
        <label className="block text-sm font-medium mb-1">Expense Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
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
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="text"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min={1}
          inputMode="decimal"
          pattern="[0-9]*"
          required
          className="w-full border rounded px-3 py-2"
          onKeyDown={e => {
            // Block letters and e/E/+/-/. at first char
            if (
              ["e", "E", "+", "-"].includes(e.key) ||
              (e.key === "." && (form.amount.includes(".") || form.amount.length === 0))
            ) {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button
        type="submit"
        colorScheme="green"
        size="md"
        className="w-full"
      >
        {initialData ? "Update Expense" : "Submit Expense"}
      </Button>
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          colorScheme="gray"
          onClick={onClose}
          className="w-full mt-1"
        >
          Cancel
        </Button>
      )}
    </form>
  );
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await getExpenses();
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  const handleSave = async (data) => {
    if (editData) {
      await updateExpense(editData._id, data);
      Swal.fire({
        title: "Updated!",
        text: "Expense updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      await addExpense(data);
      Swal.fire({
        title: "Added!",
        text: "Expense added successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    const res = await getExpenses();
    setExpenses(res.data);
    setEditData(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteExpense(id);
        const res = await getExpenses();
        setExpenses(res.data);
        Swal.fire({
          title: "Deleted!",
          text: "Expense deleted.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  // Filtered & searched expenses
  const filteredExpenses = expenses
    .filter((e) =>
      (!filterCat || e.category === filterCat) &&
      (!filterDate || e.date === filterDate) &&
      (e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        (e.expenseId && e.expenseId.toLowerCase().includes(search.toLowerCase())))
    );

  const totalExpense = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // Doughnut chart data (category distribution)
  const catTotals = CATEGORIES.map((cat) =>
    filteredExpenses.filter((e) => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0)
  );
  const doughnutData = {
    labels: CATEGORIES,
    datasets: [
      {
        data: catTotals,
        backgroundColor: [
          "#16a34a", "#f59e42", "#ef4444", "#0ea5e9", "#a21caf", "#fbbf24", "#f472b6",
          "#10b981", "#eab308", "#6366f1", "#22d3ee", "#f43f5e", "#84cc16", "#f97316", "#64748b"
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Bar */}
      <div className="bg-green-900 rounded-t-xl px-6 py-4 flex items-center justify-between">
        <span className="text-white text-xl font-bold tracking-wide flex items-center">
          <button
            onClick={() => window.location.href = "/"}
            className="mr-2 hover:scale-110 transition"
            title="Back to Dashboard"
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path fill="#fff" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8z"></path><path fill="#fff" d="M13 7h-2v6h6v-2h-4z"></path></svg>
          Newlands Tea Factory
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by category, desc, ID..."
            className="bg-green-800 text-white rounded px-3 py-1 w-56"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="bg-green-800 text-white rounded px-2 py-1"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="date"
            className="bg-green-800 text-white rounded px-2 py-1"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <Button
            colorScheme="gray"
            variant="outline"
            size="sm"
            className="!bg-green-700 !text-white px-3 rounded hover:!bg-green-800 transition"
            onClick={() => { setFilterCat(""); setFilterDate(""); setSearch(""); }}
          >
            Reset
          </Button>
          <Button
            colorScheme="green"
            variant="solid"
            size="sm"
            className="px-3 rounded hover:bg-green-600 transition"
            onClick={() => setShowChart(v => !v)}
            title="Show Doughnut Chart"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path fill="#fff" d="M11 2v20a10 10 0 100-20z"/>
              <path fill="#fff" d="M13 2.05A10.003 10.003 0 0121.95 11H13V2.05z"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Summary Cards & Doughnut Chart */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8 animate-fadeIn">
        <div className="bg-white rounded-xl p-6 shadow flex items-center">
          <div className="bg-red-100 p-4 rounded-full mr-4">
            <span className="text-2xl">💸</span>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total Expenses</div>
            <div className="text-xl font-bold text-red-700">
              ${totalExpense.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center justify-center col-span-3">
          {showChart && (
            <Box w="full" maxW="400px" h="56" display="flex" alignItems="center" justifyContent="center" mx="auto" my={2}>
              <Doughnut data={doughnutData} options={{
                plugins: {
                  legend: { display: true, position: "right" }
                },
                maintainAspectRatio: false,
                responsive: true,
              }} />
            </Box>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div>
          {showForm || editData ? (
            <ExpenseForm
              onSave={handleSave}
              initialData={editData}
              onClose={() => {
                setEditData(null);
                setShowForm(false);
              }}
            />
          ) : (
            <Button
              colorScheme="green"
              size="lg"
              className="w-full font-semibold rounded-xl shadow"
              onClick={() => setShowForm(true)}
            >
              + Add New Expense
            </Button>
          )}
        </div>
        {/* Table */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Expenses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-2 px-4">Expense ID</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-green-50 transition">
                      <td className="py-2 px-4 font-mono text-xs">{expense.expenseId || ""}</td>
                      <td className="py-2 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{expense.category}</td>
                      <td className="py-2 px-4">{expense.description}</td>
                      <td className="py-2 px-4 font-semibold">${expense.amount}</td>
                      <td className="py-2 px-4">
                        <Badge
                          colorScheme={expense.status === "Approved" ? "green" : "yellow"}
                          variant="subtle"
                          px={3}
                          py={1}
                          rounded="md"
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          {expense.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-4 space-x-2 flex">
                        <ChakraTooltip label="Edit" hasArrow>
                          <IconButton
                            icon={<FiEdit2 />}
                            aria-label="Edit"
                            colorScheme="blue"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditData(expense);
                              setShowForm(false);
                            }}
                          />
                        </ChakraTooltip>
                        <ChakraTooltip label="Delete" hasArrow>
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete"
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense._id)}
                          />
                        </ChakraTooltip>
                      </td>
                    </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-400">
                        No expenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
