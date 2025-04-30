import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import download from "downloadjs";
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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiDownload, FiTrash2, FiMenu } from "react-icons/fi";
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
  return "Admin";
}

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

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
            <td className="py-2 px-4">${statement.totals.revenue.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4">Expenses</td>
            <td className="py-2 px-4">${statement.totals.expense.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-bold">Profit</td>
            <td className="py-2 px-4 font-bold">${statement.totals.profit.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4">Cash Flow</td>
            <td className="py-2 px-4">${statement.totals.cashflow.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <div className="border-t pt-4 text-center text-sm text-gray-500">
        Statement generated for Newlands Tea Factory &mdash; {statement.date}
      </div>
    </div>
  ));

  // Responsive mobile menu links
  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/expense", label: "Expense Dashboard" },
    { to: "/budget", label: "Budget" },
    { to: "/finance", label: "Finance" },
    { to: "/reports", label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-12">
      {/* Navbar */}
      <nav className="bg-[#204d2a] text-white px-4 md:px-8 py-4 flex items-center justify-between shadow relative">
        <div className="flex items-center">
          <span className="font-bold text-xl tracking-wide flex items-center">
            <svg className="w-7 h-7 mr-2" fill="none" viewBox="0 0 24 24">
              <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8z"></path>
              <path fill="#fff" d="M13 7h-2v6h6v-2h-4z"></path>
            </svg>
            Newlands Tea Factory
          </span>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center font-medium">
          {navLinks.map((nav) => (
            <Link
              key={nav.to}
              to={nav.to}
              className={`hover:underline transition ${
                location.pathname === nav.to
                  ? "underline text-[#a7e3b6] font-bold"
                  : "hover:text-green-200"
              }`}
            >
              {nav.label}
            </Link>
          ))}
        </div>
        {/* Mobile Hamburger */}
        <IconButton
          aria-label="Open Menu"
          icon={<FiMenu />}
          display={{ base: "flex", md: "none" }}
          variant="ghost"
          color="white"
          fontSize="2xl"
          onClick={onOpen}
        />
        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="#204d2a" color="white">
            <DrawerCloseButton mt={2} />
            <DrawerBody>
              <VStack spacing={6} mt={12} align="stretch">
                {navLinks.map((nav) => (
                  <Link
                    key={nav.to}
                    to={nav.to}
                    className={`hover:underline transition text-lg ${
                      location.pathname === nav.to
                        ? "underline text-[#a7e3b6] font-bold"
                        : "hover:text-green-200"
                    }`}
                    onClick={onClose}
                  >
                    {nav.label}
                  </Link>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </nav>

      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        {/* Title */}
        <div className="mt-8 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#204d2a]">Financial Management</h1>
          <p className="text-gray-600">Generate and manage financial statements</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-8">
          <Box bg="white" rounded="xl" shadow="card" p={6} display="flex" alignItems="center">
            <Box>
              <div className="text-gray-500">Revenue</div>
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">${totalRevenue.toLocaleString()}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">${totalExpense.toLocaleString()}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">${profit.toLocaleString()}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-[#204d2a]">${cashflow.toLocaleString()}</div>
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
