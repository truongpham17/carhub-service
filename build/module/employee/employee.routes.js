"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _express = require("express");

var _employee = require("./employee.controllers");

var _employee2 = _interopRequireDefault(require("./employee.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _employee.getEmployeeList);
routes.get('/:id', _passport.auth, _employee.getEmployee);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_employee2.default.createEmployee), _employee.createEmployee);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_employee2.default.updateEmployee), _employee.updateEmployee);
var _default = routes;
exports.default = _default;