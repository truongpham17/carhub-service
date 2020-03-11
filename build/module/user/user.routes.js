"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _express = require("express");

var _user = require("./user.controllers");

var _user2 = _interopRequireDefault(require("./user.validations"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.authJwt, _user.getUserList);
routes.get('/test', _user.getTestRecord);
routes.get('/:id', _passport.authJwt, _user.getUser);
routes.post('/login', (0, _expressValidation.default)(_user2.default.login), _passport.authLocal);
routes.post('/add', _passport.authJwt, (0, _expressValidation.default)(_user2.default.createUser), _user.createUser);
routes.patch('/:id', _passport.authJwt, (0, _expressValidation.default)(_user2.default.editProfile), _user.updateUser);
routes.delete('/:id', _passport.authJwt, _user.deleteUser);
var _default = routes;
exports.default = _default;