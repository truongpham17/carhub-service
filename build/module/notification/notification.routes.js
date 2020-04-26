"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _notification = require("./notification.controllers");

var _passport = require("../../service/passport");

const routes = new _express.Router();
routes.get('/', _passport.auth, _notification.getNotifications);
routes.get('/:id', _passport.auth, _notification.getNotification);
var _default = routes;
exports.default = _default;