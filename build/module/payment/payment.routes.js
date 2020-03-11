"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _payment = require("./payment.controller");

var _payment2 = _interopRequireDefault(require("./payment.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _payment.getPayment);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_payment2.default.addPayment), _payment.createPayment);
routes.get('/:id', _passport.auth, _payment.getPaymentById);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_payment2.default.updatePayment), _payment.updatePayment);
routes.delete('/:id', _passport.auth, _payment.removePayment);
var _default = routes;
exports.default = _default;