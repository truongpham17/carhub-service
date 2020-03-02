import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: [],
    require: true,
  },
});
// );

// UserSchema.pre('save', function(next) {

// });

// UserSchema.methods = {

// };

UserSchema.index({ username: 'text' });

export default mongoose.model('User', UserSchema);
