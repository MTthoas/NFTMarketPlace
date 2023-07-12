import mongoose, { Document, Schema } from 'mongoose';

export interface Transaction extends Document {
  from: string;
  to: string;
  amount: number;
  tokenId: number;
  timestamp: Date;
}
  
export const transactionSchema = new mongoose.Schema({
    from: String,
    to: String,
    amount: Number,
    tokenId: Number,
    timestamp: { type: Date, default: Date.now }
  });
  
export default mongoose.model<Transaction>("Transaction", transactionSchema);
