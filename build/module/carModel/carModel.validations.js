"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createCarModel: {
    body: {
      name: _joi.default.string().required(),
      type: _joi.default.string().required(),
      fuelType: _joi.default.string().required(),
      numberOfSeat: _joi.default.number().required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateCarModel: {
    body: {
      name: _joi.default.string(),
      type: _joi.default.string(),
      fuelType: _joi.default.string(),
      numberOfSeat: _joi.default.number()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;