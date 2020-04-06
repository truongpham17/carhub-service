"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const sharingSchema = new _mongoose.Schema({
  rental: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    default: null
  },
  geometry: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  address: {
    type: String,
    default: ''
  },
  fromDate: {
    type: Date,
    default: Date.now()
  },
  toDate: {
    type: Date,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  sharingRequest: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'RentalSharingRequest'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

var _default = _mongoose.default.model('Sharing', sharingSchema);

exports.default = _default;