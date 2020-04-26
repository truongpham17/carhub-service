"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _expressValidation = _interopRequireDefault(require("express-validation"));

var _card = require("./card.controller");

var _card2 = _interopRequireDefault(require("./card.validtions"));

var _passport = require("../../service/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.get('/', _passport.auth, _card.getCardList);
routes.get('/:id', _passport.auth, _card.getCard);
routes.post('/', _passport.auth, (0, _expressValidation.default)(_card2.default.addCard), _card.addCard);
routes.delete('/:id', _passport.auth, _card.deleteCard);
routes.patch('/:id', _passport.auth, (0, _expressValidation.default)(_card2.default.updateCard), _card.updateCard);
var _default = routes;
exports.default = _default;