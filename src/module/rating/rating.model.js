import mongoose, { Schema } from 'mongoose';

const RatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: false,
  },
  ratingValue: {
    type: Number,
    required: true,
  },
  carMapping: {
    type: Schema.Types.ObjectId,
    ref: 'CarMapping',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Rating', RatingSchema);
