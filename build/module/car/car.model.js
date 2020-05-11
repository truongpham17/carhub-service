"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const CarSchema = new _mongoose.Schema({
  carModel: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'CarModel'
  },
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  usingYear: {
    type: Number
  },
  hub: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Hub'
  },
  currentHub: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Hub'
  },
  licensePlates: {
    type: String // bien so xe

  },
  registrationCertificate: {
    type: String // giay dang ky oto

  },
  inspectionCertificate: {
    type: String // giay chung nhan kiem dinhπ

  },
  carInsurance: {
    type: String // bao hiem xe hoi

  },
  odometer: {
    type: Number // required: true,

  },
  images: {
    type: [String] // required: false,

  },
  description: {
    type: String // required: false,

  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  feature: {
    type: String // required: false,

  },
  isActive: {
    type: Boolean,
    default: true
  },
  vin: {
    type: String // required: true,

  },
  note: {
    type: String
  }
});

var _default = _mongoose.default.model('Car', CarSchema);

exports.default = _default;