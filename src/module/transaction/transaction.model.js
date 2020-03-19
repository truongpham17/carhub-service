import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const TransactionSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    transactionType: {
      type: enums.transaction.type,
    },
    value: {
      type: String,
      required: true,
    },
    rental: {
      type: Schema.Types.ObjectId,
      ref: 'Rental',
    },
    lease: {
      type: Schema.Types.ObjectId,
      ref: 'Lease',
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
