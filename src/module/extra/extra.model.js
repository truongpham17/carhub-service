import mongoose, { Schema } from 'mongoose';

const ExtraSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Extra', ExtraSchema);
