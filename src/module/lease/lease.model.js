import mongoose, { Schema } from 'mongoose';
import enums from '../../enum';

const LeaseSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    default: null,
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
  },
  totalEarn: {
    type: Number,
  },
  status: {
    type: enums.lease.status,
    required: true,
  },
});

export default mongoose.model('Lease', LeaseSchema);
