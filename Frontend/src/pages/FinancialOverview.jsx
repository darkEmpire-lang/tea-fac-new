import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import download from "downloadjs";
import teaLogo from "../assets/teatfac.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Tooltip,
  useToast,
  Badge,
  Box,
} from "@chakra-ui/react";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import { getIncomes, getExpenses } from "../api/api";

const statementIcons = {
  "Income Statement": (
    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-2V3h-4v2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  ),
  "Balance Sheet": (
    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <path d="M2 10h20"/>
    </svg>
  ),
  "Cash Flow Statement": (
    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="16" height="20" x="4" y="2" rx="2"/>
      <path d="M8 6h8M8 10h8M8 14h8M8 18h4"/>
    </svg>
  ),
};

function getCurrentUser() {
  return "Financial Admin";
}

function formatMoney(amount) {
  return "LKR" + Number(amount).toLocaleString();
}

// High-quality PNG report component
const FinancialPNGReport = React.forwardRef(
  ({ totalRevenue, totalExpense, profit, cashflow, date }, ref) => (
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
          Financial Summary Report
        </div>
      </div>
      <div style={{ padding: "36px 32px 24px 32px" }}>
        <table style={{ width: "100%", fontSize: 18, marginBottom: 18 }}>
          <tbody>
            <tr>
              <td style={{ padding: "12px 0", fontWeight: 600 }}>Total Revenue</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700, color: "#2e865f" }}>
                {formatMoney(totalRevenue)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "12px 0", fontWeight: 600 }}>Total Expenses</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700, color: "#ef4444" }}>
                {formatMoney(totalExpense)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "12px 0", fontWeight: 600 }}>Profit</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700, color: "#17612d" }}>
                {formatMoney(profit)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "12px 0", fontWeight: 600 }}>Cash Flow</td>
              <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700, color: "#0ea5e9" }}>
                {formatMoney(cashflow)}
              </td>
            </tr>
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
            This report summarizes the key financial metrics for Newlands Tea Factory.
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

export default function FinancialOverview() {
  const [selected, setSelected] = useState("Balance Sheet");
  const [format, setFormat] = useState("Detailed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [recentStatements, setRecentStatements] = useState([
    {
      id: 1,
      type: "Income Statement",
      format: "Detailed",
      description: "Monthly revenue for Q1",
      period: "2025-01-01 to 2025-03-31",
      date: "Apr 15, 2025",
      by: "John Smith",
      totals: { revenue: 0, expense: 0, profit: 0, cashflow: 0 },
      params: { startDate: "2025-01-01", endDate: "2025-03-31" },
    },
    {
      id: 2,
      type: "Balance Sheet",
      format: "Summary",
      description: "End of March 2025",
      period: "2025-03-01 to 2025-03-31",
      date: "Apr 10, 2025",
      by: "Sarah Johnson",
      totals: { revenue: 0, expense: 0, profit: 0, cashflow: 0 },
      params: { startDate: "2025-03-01", endDate: "2025-03-31" },
    },
  ]);
  const [statementCounter, setStatementCounter] = useState(3);

  const statementRefs = useRef({});
  const toast = useToast();
  const pngRef = useRef();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([getIncomes(), getExpenses()]);
      setIncomes(incomeRes.data || []);
      setExpenses(expenseRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalRevenue = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const profit = totalRevenue - totalExpense;
  const cashflow = profit;
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });

  // PNG Download handler
  const handleDownloadPNG = async () => {
    if (!pngRef.current) return;
    toast({ title: "Generating PNG report...", status: "info", duration: 1200 });
    setTimeout(async () => {
      const canvas = await html2canvas(pngRef.current, {
        backgroundColor: "#fbfbfb",
        scale: 3,
        useCORS: true,
      });
      const dataURL = canvas.toDataURL("image/png");
      download(dataURL, `financial_report_${todayStr.replace(/\s/g, "_")}.png`, "image/png");
      toast({ title: "PNG report downloaded!", status: "success", duration: 1200 });
    }, 100);
  };

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const profitTrend = months.map((month, idx) => {
    const incomeForMonth = incomes
      .filter(i => new Date(i.date).getMonth() === idx)
      .reduce((sum, i) => sum + Number(i.amount), 0);
    const expenseForMonth = expenses
      .filter(e => new Date(e.date).getMonth() === idx)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      month,
      profit: incomeForMonth - expenseForMonth,
    };
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const period = `${startDate} to ${endDate}`;
      const newStatement = {
        id: statementCounter,
        type: selected,
        format,
        description,
        period,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        by: getCurrentUser(),
        totals: {
          revenue: totalRevenue,
          expense: totalExpense,
          profit: profit,
          cashflow: cashflow,
        },
        params: { startDate, endDate },
      };
      setRecentStatements(prev => [newStatement, ...prev]);
      setStatementCounter(prev => prev + 1);
      setLoading(false);
      toast({ title: "Statement generated!", status: "success", duration: 1200, isClosable: true });
    }, 1200);
  };

  const handleDownloadStatement = async (statement) => {
    setDownloadingId(statement.id);
    setTimeout(async () => {
      const node = statementRefs.current[statement.id];
      if (node) {
        const canvas = await html2canvas(node, { backgroundColor: "#fff" });
        const dataURL = canvas.toDataURL("image/png");
        download(dataURL, `${statement.type.replace(/\s/g, "_")}_${statement.period.replace(/\s/g, "_")}.png`, "image/png");
      }
      setDownloadingId(null);
      toast({ title: "Statement downloaded!", status: "info", duration: 1200, isClosable: true });
    }, 900);
  };

  const handleDeleteStatement = (id) => {
    setRecentStatements(prev => prev.filter(s => s.id !== id));
    toast({ title: "Statement deleted.", status: "warning", duration: 1200, isClosable: true });
  };

  const StatementPreview = React.forwardRef(({ statement }, ref) => (
    <div ref={ref} className="w-[700px] bg-white rounded-xl shadow p-8 text-[#204d2a]">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="text-2xl font-bold">Newlands Tea Factory</div>
        <div className="text-lg font-semibold">{statement.type}</div>
      </div>
      <div className="mb-3">
        <div><span className="font-semibold">Format:</span> {statement.format}</div>
        <div><span className="font-semibold">Period:</span> {statement.period}</div>
        <div><span className="font-semibold">Description:</span> {statement.description}</div>
        <div><span className="font-semibold">Generated By:</span> {statement.by}</div>
        <div><span className="font-semibold">Generated On:</span> {statement.date}</div>
      </div>
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-[#e7f8ec]">
            <th className="py-2 px-4 text-left">Type</th>
            <th className="py-2 px-4 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4">Revenue</td>
            <td className="py-2 px-4">LKR{statement.totals.revenue.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4">Expenses</td>
            <td className="py-2 px-4">LKR{statement.totals.expense.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-bold">Profit</td>
            <td className="py-2 px-4 font-bold">LKR{statement.totals.profit.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4">Cash Flow</td>
            <td className="py-2 px-4">LKR{statement.totals.cashflow.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <div className="border-t pt-4 text-center text-sm text-gray-500">
        Statement generated for Newlands Tea Factory &mdash; {statement.date}
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-12">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="mt-8 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#204d2a]">Financial Management</h1>
            <p className="text-gray-600">Generate and manage financial statements</p>
          </div>
          <Button
            colorScheme="green"
            size="md"
            mt={{ base: 4, sm: 0 }}
            onClick={handleDownloadPNG}
          >
            Download Financial Report
          </Button>
        </div>

        {/* Hidden PNG Report Template (for download) */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <FinancialPNGReport
            ref={pngRef}
            totalRevenue={totalRevenue}
            totalExpense={totalExpense}
            profit={profit}
            cashflow={cashflow}
            date={todayStr}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-8">
          <Box bg="white" rounded="xl" shadow="card" p={6} display="flex" alignItems="center">
            <Box>
              <div className="text-gray-500">Revenue</div>
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">{formatMoney(totalRevenue)}</div>
            </Box>
            <Box ml="auto" bg="#e7f8ec" rounded="full" p={3}>
              <svg className="w-7 h-7 text-[#2e865f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Box>
          </Box>
          <Box bg="white" rounded="xl" shadow="card" p={6} display="flex" alignItems="center">
            <Box>
              <div className="text-gray-500">Expenses</div>
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">{formatMoney(totalExpense)}</div>
            </Box>
            <Box ml="auto" bg="#e7f8ec" rounded="full" p={3}>
              <svg className="w-7 h-7 text-[#2e865f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
            </Box>
          </Box>
          <Box bg="white" rounded="xl" shadow="card" p={6} display="flex" alignItems="center">
            <Box>
              <div className="text-gray-500">Profit</div>
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">{formatMoney(profit)}</div>
            </Box>
            <Box ml="auto" bg="#e7f8ec" rounded="full" p={3}>
              <svg className="w-7 h-7 text-[#2e865f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Box>
          </Box>
          <Box bg="white" rounded="xl" shadow="card" p={6} display="flex" alignItems="center">
            <Box>
              <div className="text-gray-500">Cash Flow</div>
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">{formatMoney(cashflow)}</div>
            </Box>
            <Box ml="auto" bg="#e7f8ec" rounded="full" p={3}>
              <svg className="w-7 h-7 text-[#2e865f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="16" height="20" x="4" y="2" rx="2"/>
                <path d="M8 6h8M8 10h8M8 14h8M8 18h4"/>
              </svg>
            </Box>
          </Box>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow mb-10 p-4 sm:p-6">
          <div className="font-semibold text-[#204d2a] mb-2">Profit Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={profitTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="profit" stroke="#2e865f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statement Generator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Box bg="white" rounded="xl" shadow="card" p={6}>
            <div className="font-bold text-[#204d2a] mb-4">Generate Statements</div>
            <div className="flex flex-col gap-3">
              {["Income Statement", "Balance Sheet", "Cash Flow Statement"].map((type) => (
                <Button
                  key={type}
                  onClick={() => setSelected(type)}
                  colorScheme={selected === type ? "green" : "gray"}
                  variant={selected === type ? "solid" : "ghost"}
                  leftIcon={statementIcons[type]}
                  className="justify-start"
                  size="lg"
                  fontWeight="bold"
                  mb={1}
                >
                  {type}
                </Button>
              ))}
            </div>
          </Box>
          <Box bg="white" rounded="xl" shadow="card" p={6}>
            <form className="flex flex-col gap-4" onSubmit={handleGenerate}>
              <div className="font-bold text-[#204d2a] mb-4">Statement Parameters</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#204d2a] mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#204d2a] mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#204d2a] mb-1">Statement Format</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="Detailed">Detailed</option>
                  <option value="Summary">Summary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#204d2a] mb-1">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Monthly salary of employee"
                  required
                />
              </div>
              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                isLoading={loading}
                loadingText="Generating..."
                className="mt-2"
              >
                Generate Statement
              </Button>
            </form>
          </Box>
        </div>

        {/* Hidden Statement Previews for Download */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          {recentStatements.map((statement) => (
            <StatementPreview
              key={statement.id}
              statement={statement}
              ref={el => statementRefs.current[statement.id] = el}
            />
          ))}
        </div>

        {/* Recent Statements Table */}
        <Box bg="white" rounded="xl" shadow="card" p={6} mb={8} overflowX="auto">
          <div className="font-bold text-[#204d2a] mb-4">Recent Statements</div>
          <Table variant="striped" colorScheme="gray" size="md" minW="600px">
            <Thead>
              <Tr bg="#e7f8ec">
                <Th>Type</Th>
                <Th>Format</Th>
                <Th>Period</Th>
                <Th>Description</Th>
                <Th>Generated On</Th>
                <Th>By</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentStatements.map((s) => (
                <Tr key={s.id}>
                  <Td>{s.type}</Td>
                  <Td>
                    <Badge colorScheme="green" variant="subtle" fontWeight="bold">{s.format}</Badge>
                  </Td>
                  <Td>{s.period}</Td>
                  <Td>{s.description}</Td>
                  <Td>{s.date}</Td>
                  <Td>{s.by}</Td>
                  <Td>
                    <Tooltip label="Download" hasArrow>
                      <IconButton
                        icon={downloadingId === s.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#204d2a" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="#204d2a" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                        ) : (
                          <FiDownload />
                        )}
                        colorScheme="green"
                        variant="ghost"
                        size="sm"
                        aria-label="Download"
                        onClick={() => handleDownloadStatement(s)}
                        isDisabled={downloadingId === s.id}
                        mr={2}
                      />
                    </Tooltip>
                    <Tooltip label="Delete" hasArrow>
                      <IconButton
                        icon={<FiTrash2 />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        aria-label="Delete"
                        onClick={() => handleDeleteStatement(s.id)}
                        isDisabled={downloadingId === s.id}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
              {recentStatements.length === 0 && (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8} color="gray.400">
                    No statements generated yet.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </div>
    </div>
  );
}
