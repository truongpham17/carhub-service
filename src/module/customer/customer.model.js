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
    require: true,
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
});

export default mongoose.model('Customer', CustomerSchema);
