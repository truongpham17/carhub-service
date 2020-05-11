"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addLease: {
    body: {
      car: _joi.default.string().required(),
      hub: _joi.default.string(),
      startDate: _joi.default.date(),
      endDate: _joi.default.date(),
      price: _joi.default.number(),
      totalEarn: _joi.default.number(),
      cardNumber: _joi.default.string()
    },
    options: {// allowUnknownBody: false,
    }
  },
  updateLease: {
    body: {
      data: {
        car: _joi.default.string(),
        hub: _joi.default.string(),
        startDate: _joi.default.date(),
        endDate: _joi.default.date(),
        price: _joi.default.number(),
        totalEarn: _joi.default.number(),
        status: _joi.default.string(),
        message: _joi.default.string()
      },
      log: {
        title: _joi.default.string().required,
        type: _joi.default.string().required,
        note: _joi.default.string()
      }
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;