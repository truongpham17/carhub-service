"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addSharing: {
    body: {
      rental: _joi.default.string().required(),
      geometry: {
        lat: _joi.default.number(),
        lng: _joi.default.number()
      },
      fromDate: _joi.default.date(),
      toDate: _joi.default.date(),
      address: _joi.default.string(),
      price: _joi.default.number().min(0).required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateSharing: {
    body: {
      address: _joi.default.string(),
      geometry: {
        lat: _joi.default.number().min(0),
        lng: _joi.default.number().min(0)
      },
      fromDate: _joi.default.date(),
      toDate: _joi.default.date(),
      price: _joi.default.number().min(0),
      isActive: _joi.default.boolean()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;