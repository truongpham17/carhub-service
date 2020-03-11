"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _express = require("express");

var _manager = require("./manager.controllers");

var _manager2 = _interopRequireDefault(require("./manager.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _manager.getManagerList);
routes.get('/:id', _passport.auth, _manager.getManager);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_manager2.default.createManager), _manager.createManager);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_manager2.default.updateManager), _manager.updateManager);
var _default = routes;
exports.default = _default;