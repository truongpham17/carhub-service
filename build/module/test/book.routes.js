"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _express = require("express");

var _book = require("./book.controllers");

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _book.getBooks);
routes.post('/', _book.addBook);
routes.delete('/:id', _book.deleteBook);
routes.patch('/:id', _book.updateBook);
var _default = routes;
exports.default = _default;