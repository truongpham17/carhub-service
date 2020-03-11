"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _bcryptNodejs = require("bcrypt-nodejs");

var _enum = _interopRequireDefault(require("../../enum"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AccountSchema = new _mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  role: {
    type: _enum.default.account.role,
    require: true
  },
  isActive: {
    type: Boolean,
    require: true,
    default: true
  }
});
AccountSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }

  return next();
});
AccountSchema.methods = {
  hashPassword(password) {
    return (0, _bcryptNodejs.hashSync)(password);
  },

  validatePassword(password) {
    return (0, _bcryptNodejs.compareSync)(password, this.password);
  },

  generateJWT() {
    return _jsonwebtoken.default.sign({
      _id: this._id
    }, process.env.JWT_SECRET, {
      expiresIn: '5 days'
    });
  },

  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      role: this.role,
      isActive: this.isActive
    };
  },

  toAuthJSON() {
    return { ...this.toJSON(),
      token: this.generateJWT()
    };
  }

};
AccountSchema.index({
  username: 'text'
});

var _default = _mongoose.default.model('Account', AccountSchema);

exports.default = _default;