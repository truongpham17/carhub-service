import mongoose, { Schema } from 'mongoose';

const LeaseSchema = new Schema({
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
    type: String,
  },
});

export default mongoose.model('Lease', LeaseSchema);
