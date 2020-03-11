"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _passport = require("../../service/passport");

var _carModel = require("./carModel.controller");

var _carModel2 = _interopRequireDefault(require("./carModel.validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _carModel.getCarModelList);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_carModel2.default.createCarModel), _carModel.createCarModel);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_carModel2.default.updateCarModel), _carModel.updateCarModel);
routes.delete('/:id', _passport.auth, _carModel.removeCarModel);
routes.get('/:id', _passport.auth, _carModel.getCarModelById);
routes.get('/getCarByVin/:vin', _carModel.getCarModelByVin);
var _default = routes;
exports.default = _default;