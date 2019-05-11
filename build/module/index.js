'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('./user/user.routes');

var _user2 = _interopRequireDefault(_user);

var _store = require('./store/store.routes');

var _store2 = _interopRequireDefault(_store);

var _bill = require('./bill/bill.routes');

var _bill2 = _interopRequireDefault(_bill);

var _report = require('./report/report.routes');

var _report2 = _interopRequireDefault(_report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = app => {
  app.use('/user', _user2.default);
  app.use('/store', _store2.default);
  app.use('/bill', _bill2.default);
  app.use('/report', _report2.default);
};