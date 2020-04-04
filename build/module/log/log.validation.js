"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createLog: {
    body: {
      type: _joi.default.string(),
      detail: _joi.default.string(),
      note: _joi.default.string(),
      isActive: _joi.default.boolean(),
      title: _joi.default.string()
    },
    options: {
      allowUnknownBody: true
    }
  },
  updateLog: {
    body: {
      type: _joi.default.string(),
      detail: _joi.default.string(),
      note: _joi.default.string(),
      isActive: _joi.default.boolean(),
      title: _joi.default.string()
    },
    options: {
      allowUnknownBody: true
    }
  }
};
exports.default = _default;