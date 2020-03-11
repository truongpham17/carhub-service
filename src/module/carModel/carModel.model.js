import mongoose, { Schema } from 'mongoose';

const CarModelSchema = new Schema({
  name: {
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
  },
});

export default mongoose.model('CarModel', CarModelSchema);
