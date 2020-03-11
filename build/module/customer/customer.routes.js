"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _express = require("express");

var _customer = require("./customer.controllers");

var _customer2 = _interopRequireDefault(require("./customer.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _customer.getCustomerList);
routes.get('/:id', _passport.auth, _customer.getCustomer);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_customer2.default.createCustomer), _customer.createCustomer);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_customer2.default.updateCustomer), _customer.updateCustomer);
var _default = routes;
exports.default = _default;