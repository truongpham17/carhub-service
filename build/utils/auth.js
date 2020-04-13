"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authAdminOrUser = void 0;

const authAdminOrUser = (req, id) => req.user.role === 'ADMIN' || req.user._id.toString() === id.toString();

exports.authAdminOrUser = authAdminOrUser;