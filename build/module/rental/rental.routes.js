"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _rental = require("./rental.controller");

var _passport = require("../../service/passport");

var _rental2 = _interopRequireDefault(require("./rental.validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _rental.getRental);
routes.get('/:id', _passport.auth, _rental.getRentalById);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_rental2.default.addRental), _rental.addRental);
routes.put('/:id', _passport.auth, _rental.updateRental);
routes.post('/transaction/:id', _passport.auth, _rental.submitTransaction);
routes.patch('/:id', _passport.auth, _rental.updateRental);
routes.delete('/:id', _passport.auth, _rental.removeRental);
var _default = routes;
exports.default = _default;