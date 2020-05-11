"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _transaction = require("./transaction.controller");

var _passport = require("../../service/passport");

// import validate from 'express-validation';
// import validation from './lease.validations';
const routes = new _express.Router();
routes.get('/', _passport.auth, _transaction.getTransactionList);
routes.get('/paymentToken', _passport.auth, _transaction.getPaypalAccessToken);
routes.get('/:id', _passport.auth, _transaction.getTransaction);
routes.post('/', _passport.auth, _transaction.addTransaction);
routes.delete('/:id', _passport.auth, _transaction.deleteTransaction);
routes.put('/:id', _passport.auth, _transaction.updateTransaction);
var _default = routes;
exports.default = _default;