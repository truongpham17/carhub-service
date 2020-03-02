import mongoose, { Schema } from 'mongoose';
import { boolean } from 'joi';

const HubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  geoLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model('Hub', HubSchema);
