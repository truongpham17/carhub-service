"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const CustomerSchema = new _mongoose.Schema({
  account: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  fullName: {
    type: String,
    require: true
  },
  avatar: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  email: {
    type: String,
    require: true
  },
  phone: {
    type: String
  },
  license: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'License'
  },
  paypalCard: {
    type: [{
      email: String
    }]
  },
  fcmToken: {
    type: String
  }
});

var _default = _mongoose.default.model('Customer', CustomerSchema);

exports.default = _default;