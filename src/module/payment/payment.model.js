import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'modifiedDate',
    },
  }
);

export default mongoose.model('Payment', PaymentSchema);
