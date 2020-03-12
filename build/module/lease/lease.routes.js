"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _lease = require("./lease.controller");

var _lease2 = _interopRequireDefault(require("./lease.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _lease.getLeaseList);
routes.get('/:id', _passport.auth, _lease.getLease);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_lease2.default.addLease), _lease.addLease); // routes.post('/transaction/:id', auth, submitTransaction);

routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_lease2.default.updateLease), _lease.updateLease);
var _default = routes;
exports.default = _default;