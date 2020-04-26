"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addExtra: {
    body: {
      content: _joi.default.string(),
      price: _joi.default.number().min(0)
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateExtra: {
    body: {
      content: _joi.default.string(),
      price: _joi.default.number().min(0)
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;