"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createUser: {
    body: {
      username: _joi.default.string().min(5).max(50).required(),
      role: _joi.default.string().required(),
      password: _joi.default.string().min(6).max(120).required(),
      fullName: _joi.default.string().required()
    }
  },
  login: {
    body: {
      password: _joi.default.string().min(5).max(120).required(),
      username: _joi.default.string().min(5).max(50).required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  editProfile: {
    body: {
      password: _joi.default.string().min(6).max(120),
      role: _joi.default.string(),
      isActive: _joi.default.boolean()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;