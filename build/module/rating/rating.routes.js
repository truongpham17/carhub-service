"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _rating = _interopRequireDefault(require("./rating.validations"));

var _passport = require("../../service/passport");

var _rating2 = require("./rating.controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _rating2.getRatingList);
routes.get('/:id', _passport.auth, _rating2.getRatingById);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_rating.default.createRating), _rating2.createRating);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_rating.default.updateRating), _rating2.updateRating);
routes.delete('/:id', _passport.auth, _rating2.removeRating);
var _default = routes;
exports.default = _default;