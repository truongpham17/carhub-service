"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addLicense: {
    body: {
      number: _joi.default.string(),
      fullname: _joi.default.string(),
      dateOfBirth: _joi.default.date(),
      nationality: _joi.default.string(),
      address: _joi.default.string(),
      rank: _joi.default.string(),
      expires: _joi.default.date(),
      image: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateLicense: {
    body: {
      number: _joi.default.string(),
      fullname: _joi.default.string(),
      dateOfBirth: _joi.default.date(),
      nationality: _joi.default.string(),
      address: _joi.default.string(),
      rank: _joi.default.string(),
      expires: _joi.default.date(),
      image: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;