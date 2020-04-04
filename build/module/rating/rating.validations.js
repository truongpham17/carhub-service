"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createRating: {
    body: {
      customer: _joi.default.string().required(),
      content: _joi.default.string(),
      ratingValue: _joi.default.number(),
      car: _joi.default.string().required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateRating: {
    body: {
      customer: _joi.default.string(),
      content: _joi.default.string(),
      ratingValue: _joi.default.number(),
      car: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;