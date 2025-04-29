import React, { useEffect, useState } from "react";
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../api/api";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  IconButton,
  Button,
  useToast,
  Box,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Select,
  Tooltip as ChakraTooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Loading spinner
function Spinner() {
  return (
    <div className="flex justify-center items-center h-40">
      <svg className="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );
}

// CSV Export Helper
function exportCSV(data) {
  if (!data.length) return;
  const header = Object.keys(data[0]).join(",");
  const rows = data.map(row => Object.values(row).join(","));
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "income_report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Categories for select
const INCOME_CATEGORIES = [
  "Tea Sales", "Retail", "Export", "Tourism", "Grants", "Other"
];

function AddEditIncomeModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date ? initialData.date.slice(0, 10) : "",
        description: initialData.description || "",
      });
      setErrors({});
    } else {
      setForm({
        category: "",
        amount: "",
        date: "",
        description: "",
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  // Only allow numbers in amount field
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
    let errs = {};
    if (!form.category) errs.category = "Category is required";
    if (!form.amount) errs.amount = "Amount is required";
    else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(form.amount)) errs.amount = "Amount must be a valid number";
    else if (isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = "Amount must be greater than 0";
    if (!form.date) errs.date = "Date is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({
      ...form,
      amount: Number(form.amount),
    });
    toast({
      title: initialData ? "Income updated!" : "Income added!",
      status: "success",
      duration: 1200,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent borderRadius="xl" boxShadow="2xl">
        <ModalHeader fontWeight="bold" color="green.800" fontSize="2xl" borderBottom="1px solid #e6f9ed">
          {initialData ? "Edit Income" : "Add Income"}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody py={6}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.category} isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  bg="gray.50"
                >
                  {INCOME_CATEGORIES.map((cat) => (
                    <option value={cat} key={cat}>{cat}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.amount} isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  name="amount"
                  type="text"
                  value={form.amount}
                  onChange={handleChange}
                  inputMode="decimal"
                  pattern="[0-9]*"
                  bg="gray.50"
                  onKeyDown={e => {
                    if (
                      ["e", "E", "+", "-"].includes(e.key) ||
                      (e.key === "." && (form.amount.includes(".") || form.amount.length === 0))
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter amount"
                />
                <FormErrorMessage>{errors.amount}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.date} isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  bg="gray.50"
                />
                <FormErrorMessage>{errors.date}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  bg="gray.50"
                  placeholder="Description (optional)"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px solid #e6f9ed">
            <Button
              colorScheme="green"
              mr={3}
              type="submit"
              size="md"
              fontWeight="bold"
              px={8}
              boxShadow="md"
            >
              {initialData ? "Update" : "Add"}
            </Button>
            <Button onClick={onClose} variant="ghost" colorScheme="gray">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default function Incomes() {
  const [incomes, setIncomes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const toast = useToast();

  // Initial fetch with loading animation
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await getIncomes();
      setIncomes(res.data);
      setFiltered(res.data);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Filter incomes by search and date
  useEffect(() => {
    let data = incomes;
    if (search.trim()) {
      data = data.filter(
        (i) =>
          i.category?.toLowerCase().includes(search.toLowerCase()) ||
          i.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (dateRange.from) {
      data = data.filter(i => new Date(i.date) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      data = data.filter(i => new Date(i.date) <= new Date(dateRange.to));
    }
    setFiltered(data);
  }, [search, dateRange, incomes]);

  const handleSave = async (data) => {
    if (editData) {
      await updateIncome(editData._id, data);
      toast({ title: "Income updated!", status: "success", duration: 1200, isClosable: true });
    } else {
      await addIncome(data);
      toast({ title: "Income added!", status: "success", duration: 1200, isClosable: true });
    }
    const res = await getIncomes();
    setIncomes(res.data);
    setModalOpen(false);
    setEditData(null);
  };

  const handleDelete = async (id) => {
    await deleteIncome(id);
    const res = await getIncomes();
    setIncomes(res.data);
    toast({ title: "Income deleted.", status: "info", duration: 1200, isClosable: true });
  };

  // For chart: group by date (sum)
  const chartData = [];
  filtered
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();
      const existing = chartData.find((c) => c.date === date);
      if (existing) existing.amount += Number(item.amount);
      else chartData.push({ date, amount: Number(item.amount) });
    });

  const totalIncome = filtered.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-green-900 mb-1">Income Dashboard</h2>
          <p className="text-gray-600">Track all income sources and trends for your tea factory</p>
        </div>
        <Button
          onClick={() => { setModalOpen(true); setEditData(null); }}
          colorScheme="green"
          size="md"
          className="mt-4 md:mt-0 shadow-lg"
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
          }
        >
          Add Income
        </Button>
      </div>

      {/* Summary and Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white rounded-xl p-8 shadow flex items-center col-span-1">
          <div className="bg-green-100 p-5 rounded-full mr-5">
            <span className="text-3xl">💵</span>
          </div>
          <div>
            <div className="text-gray-500 text-base">Total Income</div>
            <div className="text-2xl font-bold text-green-700">
              ${totalIncome.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white rounded-xl p-6 shadow flex flex-col">
          <div className="font-semibold mb-2 text-green-900">Income Trend</div>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-6">
        <Input
          type="text"
          placeholder="Search by category or description"
          className="mb-3 md:mb-0 w-full md:w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
          bg="white"
        />
        <div className="flex space-x-2">
          <Input
            type="date"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            bg="white"
          />
          <span className="text-gray-500 font-medium flex items-center">to</span>
          <Input
            type="date"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            bg="white"
          />
        </div>
        <Button
          onClick={() => {
            setSearch("");
            setDateRange({ from: "", to: "" });
          }}
          colorScheme="gray"
          variant="outline"
          className="ml-0 md:ml-4 mt-3 md:mt-0"
        >
          Reset
        </Button>
        <Button
          onClick={() => exportCSV(filtered)}
          colorScheme="green"
          variant="outline"
          className="ml-0 md:ml-4 mt-3 md:mt-0"
        >
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Box overflowX="auto" bg="white" rounded="xl" shadow="md" p={4}>
        {loading ? (
          <Spinner />
        ) : (
          <Table variant="striped" colorScheme="gray" size="md">
            <Thead bg="gray.100">
              <Tr>
                <Th>Category</Th>
                <Th>Amount</Th>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 && (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8} color="gray.400">
                    No income records found.
                  </Td>
                </Tr>
              )}
              {filtered.map((income) => (
                <Tr key={income._id} _hover={{ bg: "gray.50" }}>
                  <Td>{income.category}</Td>
                  <Td>
                    <Badge colorScheme="green" variant="subtle" fontSize="md">
                      ${income.amount}
                    </Badge>
                  </Td>
                  <Td>{new Date(income.date).toLocaleDateString()}</Td>
                  <Td>{income.description}</Td>
                  <Td>
                    <ChakraTooltip label="Edit" hasArrow>
                      <IconButton
                        icon={<FiEdit2 />}
                        aria-label="Edit"
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                        mr={2}
                        onClick={() => {
                          setEditData(income);
                          setModalOpen(true);
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
                        onClick={() => handleDelete(income._id)}
                      />
                    </ChakraTooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Add/Edit Modal */}
      <AddEditIncomeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
      />
    </div>
  );
}
