"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roleAdmin = roleAdmin;
exports.roleMod = roleMod;

var _httpStatus = _interopRequireDefault(require("http-status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function roleAdmin(req, res, next) {
  if (req.user.role === 2) {
    return next();
  }

  return res.sendStatus(_httpStatus.default.FORBIDDEN);
}

function roleMod(req, res, next) {
  if (req.user.role >= 2) {
    return next();
  }

  return res.sendStatus(_httpStatus.default.FORBIDDEN);
}