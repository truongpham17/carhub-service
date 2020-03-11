"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _compression = _interopRequireDefault(require("compression"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _passport = _interopRequireDefault(require("passport"));

var _morgan = _interopRequireDefault(require("morgan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isProd = process.env.NODE_ENV === 'prod';

var _default = app => {
  if (isProd) {
    app.use((0, _compression.default)());
    app.use((0, _helmet.default)());
  }

  app.use((0, _morgan.default)('tiny'));
  app.use(_bodyParser.default.json({
    limit: '5mb'
  }));
  app.use(_bodyParser.default.urlencoded({
    extended: true
  }));
  app.use(_passport.default.initialize());
  app.use((0, _cors.default)({
    origin: '*'
  }));
};

exports.default = _default;