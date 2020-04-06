"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _transfer = require("./transfer.controller");

var _passport = require("../../service/passport");

// import validation from './lease.validations';
const routes = new _express.Router();
routes.get('/', _passport.auth, _transfer.getTransferList);
routes.get('/:id', _passport.auth, _transfer.getTransfer);
routes.post('/', _passport.auth, _transfer.createTransfer);
routes.delete('/:id', _passport.auth, _transfer.removeTransfer);
routes.put('/:id', _passport.auth, _transfer.updateTransfer);
var _default = routes;
exports.default = _default;