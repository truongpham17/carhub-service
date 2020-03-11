import mongoose, { Schema } from 'mongoose';

const RatingSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  content: {
    type: String,
    required: false,
  },
  ratingValue: {
    type: Number,
    required: true,
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Rating', RatingSchema);
