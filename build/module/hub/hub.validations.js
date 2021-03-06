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
      description: _joi.default.string(),
      phone: _joi.default.string(),
      geometry: {
        lat: _joi.default.number(),
        lng: _joi.default.number()
      }
    },
    options: {
      allowUnknownBody: true
    }
  },
  updateHub: {
    body: {
      name: _joi.default.string(),
      address: _joi.default.string(),
      description: _joi.default.string(),
      phone: _joi.default.string(),
      geometry: {
        lat: _joi.default.number(),
        lng: _joi.default.number()
      }
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;