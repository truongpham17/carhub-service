"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _passport = require("../../service/passport");

var _extra = _interopRequireDefault(require("./extra.validations"));

var _extra2 = require("./extra.controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _extra2.getExtra);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_extra.default.addExtra), _extra2.createExtra);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_extra.default.updateExtra), _extra2.updateExtra);
routes.delete('/:id', _passport.auth, _extra2.removeExtra);
routes.get('/:id', _extra2.getExtraById);
var _default = routes;
exports.default = _default;