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
    },
    lng: {
      type: Number,
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
