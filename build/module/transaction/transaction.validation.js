"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addTransaction: {
    body: {
      sender: _joi.default.string(),
      receiver: _joi.default.string(),
      type: _joi.default.string(),
      amount: _joi.default.number(),
      note: _joi.default.string()
    },
    options: {
      allowUnknownBody: true
    }
  },
  updateTransaction: {
    body: {
      sender: _joi.default.string(),
      receiver: _joi.default.string(),
      type: _joi.default.string(),
      amount: _joi.default.number(),
      note: _joi.default.string()
    },
    options: {
      allowUnknownBody: true
    }
  }
};
exports.default = _default;