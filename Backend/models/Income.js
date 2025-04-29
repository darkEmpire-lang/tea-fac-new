import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: String,
});

export default mongoose.model('Income', IncomeSchema);
