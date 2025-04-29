import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const getIncomes = () => axios.get(`${API_URL}/incomes`);
export const addIncome = (data) => axios.post(`${API_URL}/incomes`, data);
export const updateIncome = (id, data) => axios.put(`${API_URL}/incomes/${id}`, data);
export const deleteIncome = (id) => axios.delete(`${API_URL}/incomes/${id}`);

export const getExpenses = () => axios.get(`${API_URL}/expenses`);
export const addExpense = (data) => axios.post(`${API_URL}/expenses`, data);
export const updateExpense = (id, data) => axios.put(`${API_URL}/expenses/${id}`, data);
export const deleteExpense = (id) => axios.delete(`${API_URL}/expenses/${id}`);

export const getBudgets = () => axios.get(`${API_URL}/budgets`);
export const addBudget = (data) => axios.post(`${API_URL}/budgets`, data);
export const updateBudget = (id, data) => axios.put(`${API_URL}/budgets/${id}`, data);
export const deleteBudget = (id) => axios.delete(`${API_URL}/budgets/${id}`);
