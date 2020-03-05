import mongoose, { Schema } from 'mongoose';

const CarSchema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
  },

  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
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
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  feature: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Car', CarSchema);
