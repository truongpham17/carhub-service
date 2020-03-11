import mongoose, { Schema } from 'mongoose';
import { string } from 'joi';
import enums from '../../enum';

const RentalSchema = new Schema({
  carModel: {
    type: Schema.Types.ObjectId,
    ref: 'CarModel',
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  type: {
    type: String, // 'hub' or 'share'
    required: true,
  },
  leaser: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
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
    default: null,
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
  status: {
    type: enums.rental.status,
    required: true,
  },
});

export default mongoose.model('Rental', RentalSchema);
