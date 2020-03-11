"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _express = require("express");

var _account = require("./account.controllers");

var _account2 = _interopRequireDefault(require("./account.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _account.getAccountList);
routes.get('/:id', _passport.auth, _account.getAccount);
routes.post('/login', (0, _expressValidation.default)(_account2.default.login), _account.login);
routes.post('/signUp', (0, _expressValidation.default)(_account2.default.createUser), _account.createAccount);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_account2.default.editProfile), _account.updateAccount);
routes.delete('/:id', _passport.auth, _account.deleteAccount);
var _default = routes;
exports.default = _default;