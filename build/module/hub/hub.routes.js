"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _hub = _interopRequireDefault(require("./hub.validations"));

var _passport = require("../../service/passport");

var _hub2 = require("./hub.controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _hub2.getHubList);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_hub.default.createHub), _hub2.createHub);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_hub.default.updateHub), _hub2.updateHub);
routes.delete('/:id', _passport.auth, _hub2.removeHub);
routes.get('/:id', _passport.auth, _hub2.getHubById);
var _default = routes;
exports.default = _default;