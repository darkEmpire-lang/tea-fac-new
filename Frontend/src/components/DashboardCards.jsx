import React from "react";

const Card = ({ title, value, icon, color, change }) => (
  <div className={`flex flex-col p-5 rounded-xl shadow-md bg-white hover:scale-105 transition-transform duration-300 border-l-8 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-gray-500 font-semibold">{title}</h4>
        <div className="text-2xl font-bold">{value}</div>
        {change && <div className="text-sm text-green-500">{change}</div>}
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </div>
);

export default function DashboardCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
      <Card title="Total Revenue" value={`$${data.totalIncome}`} icon="💰" color="border-green-400" change={data.incomeChange} />
      <Card title="Total Expenses" value={`$${data.totalExpense}`} icon="🧾" color="border-red-400" change={data.expenseChange} />
      <Card title="Net Profit" value={`$${data.netProfit}`} icon="📈" color="border-blue-400" change={data.profitChange} />
      <Card title="Total Orders" value={data.totalOrders} icon="📦" color="border-yellow-400" change={data.ordersChange} />
    </div>
  );
}
