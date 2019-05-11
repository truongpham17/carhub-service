'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  register: {
    body: {
      password: _joi2.default.string().min(6).max(120).required(),
      username: _joi2.default.string().min(5).max(20).required()
    }
  },
  createUser: {
    body: {
      password: _joi2.default.string().min(6).max(120).required(),
      username: _joi2.default.string().min(5).max(20).required()
    }
  },
  login: {
    body: {
      password: _joi2.default.string().min(6).max(120).required(),
      username: _joi2.default.string().min(5).max(20).required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  editProfile: {
    body: {
      password: _joi2.default.string().min(6).max(120),
      username: _joi2.default.string().min(5).max(20)
    },
    options: {
      allowUnknownBody: false
    }
  }
};