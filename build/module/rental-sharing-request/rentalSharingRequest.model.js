"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _enum = _interopRequireDefault(require("../../enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const listSharingSchema = new _mongoose.Schema({
  sharing: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Sharing'
  },
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  message: {
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
  totalCost: {
    type: Number,
    default: 0
  },
  status: {
    type: _enum.default.listSharingRequest.status,
    default: 'PENDING'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

var _default = _mongoose.default.model('RentalSharingRequest', listSharingSchema);

exports.default = _default;