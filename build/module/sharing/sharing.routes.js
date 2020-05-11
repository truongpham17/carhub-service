"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _passport = require("../../service/passport");

var _sharing = require("./sharing.controller");

var _sharing2 = _interopRequireDefault(require("./sharing.validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _sharing.getSharing);
routes.get('/:id', _passport.auth, _sharing.getSharingById);
routes.get('/rental/:id', _passport.auth, _sharing.getSharingByRentalId);
routes.get('/latest/rental/:id', _passport.auth, _sharing.getLatestSharingByRental);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_sharing2.default.addSharing), _sharing.addSharing);
routes.post('/createSharingFromRental', _passport.auth, (0, _expressValidation.default)(_sharing2.default.createFromRental), _sharing.createSharingFromRental);
routes.post('/confirm/rental/:id', _passport.auth, _sharing.confirmSharing);
routes.post('/suggestion', _passport.auth, _sharing.suggestSharing);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_sharing2.default.updateSharing), _sharing.updateSharing);
routes.delete('/:id', _passport.auth, _sharing.removeSharing);
routes.delete('/latest/rental/:id', _passport.auth, _sharing.removeLatestSharingByRental);
var _default = routes;
exports.default = _default;