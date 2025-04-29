import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';

export const createExpense = async (req, res) => {
  const { category, amount } = req.body;
  let budget = await Budget.findOne({ category });
  if (budget) {
    budget.spent += amount;
    await budget.save();
    // Notification logic for budget exceeded can be added here
  }
  const expense = new Expense(req.body);
  await expense.save();
  res.status(201).json(expense);
};

export const getExpenses = async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
};

export const updateExpense = async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(expense);
};

export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
