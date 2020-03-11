"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createHub: {
    body: {
      name: _joi.default.string().required(),
      address: _joi.default.string().required(),
      description: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateHub: {
    body: {
      name: _joi.default.string(),
      address: _joi.default.string(),
      description: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;