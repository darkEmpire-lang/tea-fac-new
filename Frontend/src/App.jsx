import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Incomes from "./pages/Incomes";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import FinancialOverview from "./pages/FinancialOverview";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
     
      <Route path="/income" element={<Incomes />} /> 
      <Route path="/expense" element={<Expenses />} />
      <Route path="/budget" element={<Budgets />} />
      {/* <Route path="/report" element={<Report />} /> */}
    <Route path="/finance" element={<FinancialOverview />} />

    </Routes>
  );
}
