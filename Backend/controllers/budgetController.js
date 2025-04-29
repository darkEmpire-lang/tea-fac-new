import Budget from '../models/Budget.js';

export const createBudget = async (req, res) => {
  const budget = new Budget(req.body);
  await budget.save();
  res.status(201).json(budget);
};

export const getBudgets = async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
};

export const updateBudget = async (req, res) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(budget);
};

export const deleteBudget = async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
