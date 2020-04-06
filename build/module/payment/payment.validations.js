"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addPayment: {
    body: {
      type: _joi.default.string().required(),
      amount: _joi.default.number().min(0).required(),
      note: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updatePayment: {
    body: {
      type: _joi.default.string(),
      amount: _joi.default.number().min(0),
      note: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;