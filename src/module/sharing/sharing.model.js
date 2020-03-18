import mongoose, { Schema } from 'mongoose';

const sharingSchema = new Schema({
  rental: {
    type: Schema.Types.ObjectId,
    ref: 'Rental',
    default: null,
  },
  geometry: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  location: {
    type: String,
    default: '',
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  requestUser: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Sharing', sharingSchema);
