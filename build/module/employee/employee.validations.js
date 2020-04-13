"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createEmployee: {
    body: {
      hub: _joi.default.string().required(),
      fullName: _joi.default.string().required(),
      avatar: _joi.default.string().required(),
      dateOfBirth: _joi.default.string(),
      email: _joi.default.string(),
      phone: _joi.default.string(),
      account: _joi.default.string().required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateEmployee: {
    body: {
      hub: _joi.default.string(),
      fullName: _joi.default.string(),
      avatar: _joi.default.string(),
      dateOfBirth: _joi.default.string(),
      email: _joi.default.string(),
      phone: _joi.default.string(),
      fcmToken: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;