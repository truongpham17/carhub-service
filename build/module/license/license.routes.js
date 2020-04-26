"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _license = require("./license.controller");

var _license2 = _interopRequireDefault(require("./license.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _license.getLicenseList);
routes.get('/:id', _passport.auth, _license.getLicense);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_license2.default.addLicense), _license.addLicense);
routes.delete('/:id', _passport.auth, _license.deleteLicense);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_license2.default.updateLicense), _license.updateLicense);
var _default = routes;
exports.default = _default;