"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  register: {
    body: {
      fullname: _joi.default.string(),
      role: _joi.default.number(),
      password: _joi.default.string().min(6).max(120).required(),
      username: _joi.default.string().min(5).max(20).required()
    }
  },
  createUser: {
    body: {
      password: _joi.default.string().min(6).max(120).required(),
      fullname: _joi.default.string(),
      role: _joi.default.number(),
      username: _joi.default.string().min(5).max(20).required()
    }
  },
  login: {
    body: {
      password: _joi.default.string().min(6).max(120).required(),
      username: _joi.default.string().min(5).max(20).required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  editProfile: {
    body: {
      password: _joi.default.string().min(6).max(120),
      username: _joi.default.string().min(5).max(20),
      fullname: _joi.default.string(),
      role: _joi.default.number(),
      active: _joi.default.boolean()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;