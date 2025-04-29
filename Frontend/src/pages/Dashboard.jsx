import React, { useState, useEffect } from "react";
import { Box, Button, Center, useTheme } from "@chakra-ui/react";
import { Link } from "react-router-dom";

// SVG icons
const icons = {
  report: (
    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-2V3h-4v2H7a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  ),
  expense: (
    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 9V7a5 5 0 00-10 0v2a5 5 0 00-3 4.58v2.42a5 5 0 005 5h6a5 5 0 005-5v-2.42A5 5 0 0017 9z"/>
    </svg>
  ),
  budget: (
    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <path d="M2 10h20"/>
    </svg>
  ),
  invoice: (
    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="16" height="20" x="4" y="2" rx="2"/>
      <path d="M8 6h8M8 10h8M8 14h8M8 18h4"/>
    </svg>
  ),
};

const dashboardCards = [
  {
    title: "Financial Overview",
    desc: "Generate comprehensive financial reports and analytics",
    icon: icons.report,
    link: "/finance",
  },
  {
    title: "Expense Tracking",
    desc: "Monitor and manage all factory expenses",
    icon: icons.expense,
    link: "/expense",
  },
  {
    title: "Budgeting",
    desc: "Plan and allocate budgets for different departments",
    icon: icons.budget,
    link: "/budget",
  },
  {
    title: "Income Tracking",
    desc: "Monitor and manage all factory incomes",
    icon: icons.invoice,
    link: "/income",
  },
];

function DashboardSpinner() {
  return (
    <Center minH="300px">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-green-600 border-b-4 border-green-200"></div>
    </Center>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      {/* Navbar */}
      <Box as="nav" bg="brand.700" color="white" px={8} py={4} display="flex" alignItems="center" justifyContent="space-between" boxShadow="navbar">
        <span className="font-bold text-2xl tracking-wide flex items-center">
          <svg className="w-8 h-8 mr-2" fill="none" viewBox="0 0 24 24">
            <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8z"></path>
            <path fill="#fff" d="M13 7h-2v6h6v-2h-4z"></path>
          </svg>
          Newlands Tea Factory
        </span>
        <Box className="flex space-x-8 items-center font-medium">
          <Link to="/" className="hover:underline hover:text-green-300 transition">Dashboard</Link>
          <Link to="/summaries" className="hover:underline hover:text-green-300 transition">Summaries</Link>
          <Link to="/report" className="hover:underline hover:text-green-300 transition">Reports</Link>
          <Link to="/income" className="hover:underline hover:text-green-300 transition hidden md:inline">Income</Link>
          <Link to="/expense" className="hover:underline hover:text-green-300 transition hidden md:inline">Expense</Link>
          <Link to="/budget" className="hover:underline hover:text-green-300 transition hidden md:inline">Budget</Link>
          <span className="ml-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </span>
        </Box>
      </Box>

      {/* Main Content */}
      <Center flex="1" px={4} py={10}>
        <Box w="full" maxW="6xl">
          <Box textAlign="center" mb={10}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 mt-2">Financial Management Dashboard</h1>
            <p className="text-gray-600 mb-6 text-lg">
              Welcome to Newlands Tea Factory financial management system
            </p>
          </Box>
          {loading ? (
            <DashboardSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {dashboardCards.map((card, idx) => (
                <Link
                  to={card.link}
                  key={card.title}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition p-10 flex items-center justify-between border-l-8 border-green-200 hover:border-green-500 hover:scale-105 duration-300"
                  style={{ animation: `fadeInUp 0.6s ${0.1 * idx + 0.2}s both` }}
                >
                  <div className="flex items-center">
                    <div className="mr-6">{card.icon}</div>
                    <div>
                      <div className="font-bold text-2xl text-gray-800 group-hover:text-green-700">{card.title}</div>
                      <div className="text-gray-500 text-base mt-2">{card.desc}</div>
                    </div>
                  </div>
                  <div>
                    <svg className="w-10 h-10 text-green-500 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Box>
      </Center>

      {/* Footer */}
      <Box as="footer" bg="brand.700" color="white" px={8} py={3} display="flex" flexDirection={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" mt="auto">
        <span className="text-sm">&copy; 2025 Newlands Tea Factory. All rights reserved.</span>
        <Box className="flex space-x-6 mt-2 md:mt-0">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </Box>
      </Box>

      {/* Fade In Animation */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </Box>
    
  );
}
