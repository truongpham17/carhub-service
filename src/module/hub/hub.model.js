import mongoose, { Schema } from 'mongoose';

const HubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  geometry: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  description: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: 'true',
  },
});

export default mongoose.model('Hub', HubSchema);
