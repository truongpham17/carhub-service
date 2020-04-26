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
routes.get('/:id', _passport.auth, _carModel.getCarModelById);
routes.get('/getCarByVin/:vin', _carModel.getCarModelByVin);
routes.get('/findByName/:name', _passport.auth, _carModel.findCarModelByName);
routes.post('/createCarModel', _passport.auth, _carModel.createCarModelBySendingLease); // routes.post('/', auth, validate(carValidations.createCarModel), createCarModel);

routes.post('/', _passport.auth, _carModel.createCarModel);
routes.post('/search', _carModel.searchNearByCarModel);
routes.put('/transfer', _passport.auth, _carModel.transferCarModel);
routes.put('/:id', _passport.auth, (0, _expressValidation.default)(_carModel2.default.updateCarModel), _carModel.updateCarModel);
routes.get('/:id', _passport.auth, _carModel.getCarModelById);
routes.get('/getCarByVin/:vin', _carModel.getCarModelByVin);
routes.get('/', _carModel.getCarModelList);
routes.post('/', (0, _expressValidation.default)(_carModel2.default.createCarModel), _carModel.createCarModel);
routes.put('/:id', (0, _expressValidation.default)(_carModel2.default.updateCarModel), _carModel.updateCarModel);
routes.delete('/:id', _carModel.removeCarModel);
var _default = routes;
exports.default = _default;