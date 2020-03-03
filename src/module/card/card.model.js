import mongoose, { Schema } from 'mongoose';

const CardSchema = new Schema({
  number: {
    type: String,
  },
  name: {
    type: String,
  },
  expiredDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Card', CardSchema);
