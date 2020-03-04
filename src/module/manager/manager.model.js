import mongoose, { Schema } from 'mongoose';

const ManagerSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'EmployeeSchema',
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

export default mongoose.model('Manager', ManagerSchema);
