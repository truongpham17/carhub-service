"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _joi = require("joi");

var _enum = _interopRequireDefault(require("../../enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const RentalSchema = new _mongoose.Schema({
  carModel: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'CarModel'
  },
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  type: {
    type: String,
    // 'hub' or 'share'
    required: true
  },
  leaser: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  startDate: {
    type: Date,
    default: new Date()
  },
  endDate: {
    type: Date,
    default: new Date()
  },
  pickupHub: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Hub'
  },
  pickoffHub: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Hub'
  },
  price: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  payment: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  extra: {
    type: [{
      extra: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Extra'
      },
      quantity: {
        type: Number,
        default: 0
      },
      amount: {
        type: Number,
        default: 0
      },
      note: {
        type: String,
        default: ''
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  status: {
    type: _enum.default.rental.status,
    required: true,
    default: 'UPCOMING'
  }
});

var _default = _mongoose.default.model('Rental', RentalSchema);

exports.default = _default;