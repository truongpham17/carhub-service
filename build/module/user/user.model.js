"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _bcryptNodejs = require("bcrypt-nodejs");

var _constants = _interopRequireDefault(require("../../config/constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: [5, 'Username must equal or longer than 5'],
    maxlength: [20, 'Username must equal or shorter than 20']
  },
  password: {
    type: String,
    minlength: [6, 'Password must equal or longer than 6']
  },
  fullname: String,
  role: Number,
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }

  return next();
});
UserSchema.methods = {
  hashPassword(password) {
    return (0, _bcryptNodejs.hashSync)(password);
  },

  validatePassword(password) {
    return (0, _bcryptNodejs.compareSync)(password, this.password);
  },

  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + lifespan);
    return _jsonwebtoken.default.sign({
      _id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, _constants.default.JWT_SECRET);
  },

  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      role: this.role,
      active: this.active
    };
  },

  toAuthJSON() {
    return { ...this.toJSON(),
      token: this.generateJWT(_constants.default.AUTH_TOKEN_LIFESPAN)
    };
  }

};
UserSchema.index({
  username: 'text'
});

var _default = _mongoose.default.model('User', UserSchema);

exports.default = _default;