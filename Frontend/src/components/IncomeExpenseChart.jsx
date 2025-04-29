import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function IncomeExpenseChart({ incomeData, expenseData }) {
  const labels = incomeData.map(i => i.date);
  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData.map(i => i.amount),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
      {
        label: "Expense",
        data: expenseData.map(e => e.amount),
        backgroundColor: "rgba(239,68,68,0.7)",
      },
    ],
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h4 className="font-semibold mb-4">Income vs Expense</h4>
      <Bar data={data} height={80} />
    </div>
  );
}
