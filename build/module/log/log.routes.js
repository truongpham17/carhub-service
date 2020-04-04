"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _passport = require("../../service/passport");

var _log = _interopRequireDefault(require("./log.validation"));

var _log2 = require("./log.controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _log2.getLogList);
routes.get('/:id', _passport.auth, _log2.getLog);
routes.get('/group/:id', _passport.auth, _log2.getGroupingLog);
routes.post('/', _passport.auth, _log2.createLog);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_log.default.updateLog), _log2.updateLog);
routes.delete('/:id', _passport.auth, _log2.removeLog);
var _default = routes;
exports.default = _default;