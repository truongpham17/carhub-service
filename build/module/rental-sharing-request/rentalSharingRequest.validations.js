"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addSharingRequest: {
    body: {
      customer: _joi.default.string(),
      sharing: _joi.default.string(),
      message: _joi.default.string(),
      fromDate: _joi.default.date(),
      toDate: _joi.default.date()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateSharingRequest: {
    body: {
      status: _joi.default.string(),
      isActive: _joi.default.boolean(),
      fromDate: _joi.default.date(),
      toDate: _joi.default.date(),
      totalCost: _joi.default.number().min(0)
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;