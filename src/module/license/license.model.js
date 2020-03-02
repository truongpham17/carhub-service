import mongoose, { Schema } from 'mongoose';

const LicenseSchema = new Schema({
  number: {
    type: String,
  },
  fullname: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  nationality: {
    type: String,
  },
  address: {
    type: String,
  },
  rank: {
    type: String,
  },
  expires: {
    type: Date,
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('LicenseSchema', LicenseSchema);
