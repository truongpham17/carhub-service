import mongoose, { Schema } from 'mongoose';
import { number, boolean } from 'joi';

const CarSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  VIN: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  numberOfSeat: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Car', CarSchema);