import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import constants from '../../config/constants';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: [120, 'Email must equal or shorter than 120'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must equal or longer than 6'],
      maxlength: [120, 'Password must equal or shorter than 120'],
    },
    name: {
      type: String,
      required: true,
      minlength: [3, 'Fullname must equal or longer than 3'],
      maxlength: [80, 'Fullname must equal or shorter than 80'],
    },
    role: {
      type: Number, // 0: User, 1: Mod, 2: Admin
      required: true,
      default: 0,
      validate: {
        validator(v) {
          return v >= 0 && v <= 2;
        },
        message: props => `${props.value} is not a valid role number`,
      },
    },
    avatar: {
      trim: true,
      type: String,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

UserSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },
  validatePassword(password) {
    return compareSync(password, this.password);
  },
  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + lifespan);

    return jwt.sign(
      {
        _id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      constants.JWT_SECRET
    );
  },
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      isConfirmed: this.isConfirmed,
      role: this.role,
      avatar: this.avatar,
    };
  },
  toAuthJSON() {
    return {
      ...this.toJSON(),
      token: this.generateJWT(constants.AUTH_TOKEN_LIFESPAN),
    };
  },
};

UserSchema.index({ name: 'text' });

export default mongoose.model('User', UserSchema);
