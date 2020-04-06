"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _passport = require("../../service/passport");

var _car = require("./car.controller");

var _car2 = _interopRequireDefault(require("./car.validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _car.getCarList);
routes.get('/list', _passport.auth, _car.getCustomerPreviousCarList);
routes.get('/hubCarList', _passport.auth, _car.getHubCarList);
routes.post('/createCarAfterChecking', _passport.auth, _car.createCarAfterCheckingVin);
routes.get('/:id', _passport.auth, _car.getCarById);
routes.get('/hub/:id', _passport.auth, _car.getCarsByHub);
routes.get('/customer/:id', _passport.auth, _car.getCarsByCustomer);
routes.get('/checkVin/:vin', _car.checkCarByVin); // routes.post('/', auth, validate(carValidations.createCar), createCar);

routes.post('/', _passport.auth, _car.createCar);
routes.put('/transfer', _passport.auth, _car.transferLeasingCar);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_car2.default.updateCar), _car.updateCar);
routes.delete('/:id', _passport.auth, _car.removeCar);
var _default = routes;
exports.default = _default;