import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const LeaseSchema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
  },
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  price: {
    type: Number,
    default: 0,
  },
  totalEarn: {
    type: Number,
    default: 0,
  },
  status: {
    type: enums.lease.status,
    required: true,
    default: 'PENDING',
    // required: true,
  },
  cardNumber: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: 'true',
  },
  message: {
    type: String,
  },
});

export default mongoose.model('Lease', LeaseSchema);
