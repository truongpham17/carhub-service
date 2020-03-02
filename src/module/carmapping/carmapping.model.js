import mongoose, { Schema } from 'mongoose';

const CarMappingSchema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
    required: true,
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
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model('CarMapping', CarMappingSchema);
