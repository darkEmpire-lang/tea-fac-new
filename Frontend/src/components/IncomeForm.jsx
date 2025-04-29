import React, { useState } from 'react';
import { Box, Input, Button, Select, Stack } from '@chakra-ui/react';

const categories = [
  "Tea Sales", "Subsidy", "Other"
];

const IncomeForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ category: '', amount: '', date: '', description: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.date) {
      alert("Fill all required fields");
      return;
    }
    onSubmit(form);
    setForm({ category: '', amount: '', date: '', description: '' });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="white" p={5} borderRadius="lg" boxShadow="md">
      <Stack spacing={3}>
        <Select name="category" value={form.category} onChange={handleChange} placeholder="Select Category" required>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
        <Input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" required />
        <Input name="date" type="date" value={form.date} onChange={handleChange} required />
        <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <Button type="submit" colorScheme="green" width="full">Add Income</Button>
      </Stack>
    </Box>
  );
};

export default IncomeForm;
