import mongoose, { Schema } from 'mongoose';

const CarSchema = new Schema({
  carModel: {
    type: Schema.Types.ObjectId,
    ref: 'CarModel',
  },

  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },

  usingYear: {
    type: Number,
  },
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
  },

  currentHub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
  },
  odometer: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  feature: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  VIN: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Car', CarSchema);
