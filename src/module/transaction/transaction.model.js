import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const TransactionSchema = new Schema(
  {
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
    type: {
      type: enums.transaction.type,
    },
    amount: {
      type: Number,
    },
    note: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: 'true',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Transaction', TransactionSchema);
