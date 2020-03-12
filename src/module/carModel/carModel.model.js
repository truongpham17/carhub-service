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
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
});

export default mongoose.model('CarModel', CarModelSchema);
