import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: String,
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' }
});

export default mongoose.model('Expense', ExpenseSchema);
