import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 }
});

export default mongoose.model('Budget', BudgetSchema);
