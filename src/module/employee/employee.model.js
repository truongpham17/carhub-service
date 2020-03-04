import mongoose, { Schema } from 'mongoose';

const EmployeeSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'Hub',
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

export default mongoose.model('Employee', EmployeeSchema);
