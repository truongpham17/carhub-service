"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _test = require("./test.controllers");

const routes = new _express.Router();
routes.get('/', _test.getTest);
routes.post('/', _test.createTest);
routes.delete('/:id', _test.deleteTest);
routes.put('/:id', _test.updateTest);
routes.get('/:id', _test.getTestById); // routes.get('/test', getTestRecord);
// routes.get('/:id', authJwt, getUser);
// routes.post('/login', validate(Validations.login), authLocal);
// routes.post('/add', authJwt, validate(Validations.createUser), createUser);
// routes.patch('/:id', authJwt, validate(Validations.editProfile), updateUser);
// routes.delete('/:id', authJwt, deleteUser);

var _default = routes;
exports.default = _default;