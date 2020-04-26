"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _passport = require("../../service/passport");

var _rentalSharingRequest = _interopRequireDefault(require("./rentalSharingRequest.validations"));

var _rentalSharingRequest2 = require("./rentalSharingRequest.controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _rentalSharingRequest2.getRentalSharingRequest);
routes.get('/customer', _passport.auth, _rentalSharingRequest2.getRentalSharingByCustomer);
routes.get('/sharing/:id', _passport.auth, _rentalSharingRequest2.getRentalRequestBySharing);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_rentalSharingRequest.default.addSharingRequest), _rentalSharingRequest2.addRentalSharingRequest);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_rentalSharingRequest.default.updateSharingRequest), _rentalSharingRequest2.updateRentalSharingRequest);
routes.patch('/accept/:id', _passport.auth, _rentalSharingRequest2.acceptRentalSharingRequest);
routes.patch('/decline/:id', _passport.auth, _rentalSharingRequest2.declineRentalSharingRequest);
routes.delete('/:id', _passport.auth, _rentalSharingRequest2.deleteRentalSharingRequest);
var _default = routes;
exports.default = _default;