import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const TransactionSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
    },
    receiver: {
      type: Schema.Types.ObjectId,
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
