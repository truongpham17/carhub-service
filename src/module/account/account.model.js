import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

import { compareSync, hashSync } from 'bcrypt-nodejs';
import enums from '../../enum';

const AccountSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: enums.account.role,
    require: true,
  },
  isActive: {
    type: Boolean,
    require: true,
    default: true,
  },
});

AccountSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

AccountSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },
  validatePassword(password) {
    return compareSync(password, this.password);
  },
  generateJWT() {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '5 days',
      }
    );
  },
  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      role: this.role,
      isActive: this.isActive,
    };
  },
  toAuthJSON() {
    return {
      ...this.toJSON(),
      token: this.generateJWT(),
    };
  },
};

AccountSchema.index({ username: 'text' });

export default mongoose.model('Account', AccountSchema);
