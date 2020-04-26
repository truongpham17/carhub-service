import mongoose, { Schema } from 'mongoose';

const CustomerSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  fullName: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
  },
  license: {
    type: Schema.Types.ObjectId,
    ref: 'License',
  },
  paypalCard: {
    type: [{ email: String }],
  },
  fcmToken: {
    type: String,
  },
});

export default mongoose.model('Customer', CustomerSchema);
