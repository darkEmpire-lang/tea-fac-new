import React, { useState, useEffect } from "react";
import { Box, Button, Center } from "@chakra-ui/react";
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
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-green-600 border-b-4"></div>
    </Center>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      {/* Main Content */}
      <Center flex="1" px={{ base: 2, sm: 4 }} py={{ base: 6, md: 10 }}>
        <Box w="full" maxW="6xl">
          <Box textAlign="center" mb={10}>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2 mt-2">Financial Management Dashboard</h1>
            <p className="text-gray-600 mb-6 text-lg">
              Welcome to Newlands Tea Factory financial management system
            </p>
          </Box>
          {loading ? (
            <DashboardSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
              {dashboardCards.map((card, idx) => (
                <Link
                  to={card.link}
                  key={card.title}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition p-8 md:p-10 flex items-center justify-between border-l-8 border-green-200 hover:border-green-500 hover:scale-105 duration-300"
                  style={{ animation: `fadeInUp 0.6s ${0.1 * idx + 0.2}s both` }}
                >
                  <div className="flex items-center">
                    <div className="mr-6">{card.icon}</div>
                    <div>
                      <div className="font-bold text-xl md:text-2xl text-gray-800 group-hover:text-green-700">{card.title}</div>
                      <div className="text-gray-500 text-base mt-2">{card.desc}</div>
                    </div>
                  </div>
                  <div>
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-green-500 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
      <Box
        as="footer"
        bg="brand.700"
        color="white"
        px={{ base: 4, md: 8 }}
        py={3}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        mt="auto"
      >
        <span className="text-sm text-center">&copy; 2025 Newlands Tea Factory. All rights reserved.</span>
        <Box className="flex flex-wrap justify-center space-x-6 mt-2 md:mt-0">
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
