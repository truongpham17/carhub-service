import mongoose, { Schema } from 'mongoose';

const RentalSchema = new Schema({
  carMapping: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
  },
  leaser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  pickupHub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
  },
  pickoffHub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
  },
  price: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
  extra: {
    type: [
      {
        extra: {
          type: Schema.Types.ObjectId,
          ref: 'Extra',
        },
        quantity: {
          type: Number,
          default: 0,
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
    ],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Rental', RentalSchema);
