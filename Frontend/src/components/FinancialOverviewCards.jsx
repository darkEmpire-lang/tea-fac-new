import React from 'react';

const FinancialOverviewCards = ({ totalIncome, totalExpense, netProfit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white shadow rounded-lg p-6 relative">
        <div className="absolute top-4 right-4 text-green-500 text-3xl font-bold">$</div>
        <h3 className="text-lg font-semibold mb-2">Total Income</h3>
        <p className="text-2xl font-bold text-green-700">${totalIncome.toLocaleString()}</p>
        <p className="text-gray-500">All time</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6 relative">
        <div className="absolute top-4 right-4 text-red-500 text-3xl font-bold">-$</div>
        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-700">${totalExpense.toLocaleString()}</p>
        <p className="text-gray-500">All time</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6 relative">
        <div className="absolute top-4 right-4 text-blue-500 text-3xl font-bold">#</div>
        <h3 className="text-lg font-semibold mb-2">Net Profit</h3>
        <p className={netProfit >= 0 ? 'text-2xl font-bold text-blue-700' : 'text-2xl font-bold text-red-700'}>
          ${netProfit.toLocaleString()}
        </p>
        <p className="text-gray-500">All time</p>
      </div>
    </div>
  );
};

export default FinancialOverviewCards;
