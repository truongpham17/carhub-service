"use strict";

var _express = _interopRequireDefault(require("express"));

var _constants = _interopRequireDefault(require("./config/constants"));

var _middlewares = _interopRequireDefault(require("./config/middlewares"));

require("./config/database");

var _module = _interopRequireDefault(require("./module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
(0, _middlewares.default)(app);
(0, _module.default)(app);
app.listen(_constants.default.PORT, () => {
  console.log('CAR HUB SERVICE STARTS');
  console.log(`
      PORT:       ${_constants.default.PORT}
      ENV:        ${process.env.NODE_ENV}`);
});
process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});