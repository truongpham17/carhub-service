"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _constants = _interopRequireDefault(require("./constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose.default.Promise = global.Promise;

try {
  _mongoose.default.connect(_constants.default.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
} catch (err) {
  _mongoose.default.createConnection(_constants.default.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
}

_mongoose.default.connection.once('open', () => console.log(`      MONGODB:    ${_constants.default.MONGO_URL} 🌱

    `)).on('error', e => {
  console.log(`      MONGODB:    ${e.message} 🥀

    `);
});