"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addCard: {
    body: {
      name: _joi.default.string(),
      number: _joi.default.string(),
      expiredDate: _joi.default.date()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateCard: {
    body: {
      name: _joi.default.string(),
      number: _joi.default.string(),
      expiredDate: _joi.default.date()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;