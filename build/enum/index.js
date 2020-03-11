"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  account: {
    role: {
      ENUM: ['CUSTOMER', 'EMPLOYEE', 'MANAGER']
    }
  },
  rental: {
    status: {
      ENUM: ['UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST']
    }
  },
  lease: {
    status: {
      ENUM: ['PENDING', 'AVAILABLE', 'HIRING', 'WAIT_TO_RETURN', 'PAST']
    }
  }
};
exports.default = _default;