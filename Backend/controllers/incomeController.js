import Income from '../models/Income.js';

export const createIncome = async (req, res) => {
  const income = new Income(req.body);
  await income.save();
  res.status(201).json(income);
};

export const getIncomes = async (req, res) => {
  const incomes = await Income.find();
  res.json(incomes);
};

export const updateIncome = async (req, res) => {
  const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(income);
};

export const deleteIncome = async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
