"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _book = _interopRequireDefault(require("./test/book.routes"));

var _carModel = _interopRequireDefault(require("./carModel/carModel.routes"));

var _car = _interopRequireDefault(require("./car/car.routes"));

var _hub = _interopRequireDefault(require("./hub/hub.routes"));

var _rating = _interopRequireDefault(require("./rating/rating.routes"));

var _account = _interopRequireDefault(require("./account/account.routes"));

var _customer = _interopRequireDefault(require("./customer/customer.routes"));

var _employee = _interopRequireDefault(require("./employee/employee.routes"));

var _manager = _interopRequireDefault(require("./manager/manager.routes"));

var _user = _interopRequireDefault(require("./user/user.routes"));

var _test = _interopRequireDefault(require("./test/test.routes"));

var _extra = _interopRequireDefault(require("./extra/extra.routes"));

var _payment = _interopRequireDefault(require("./payment/payment.routes"));

var _rental = _interopRequireDefault(require("./rental/rental.routes"));

var _license = _interopRequireDefault(require("./license/license.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = app => {
  app.use('/test', _test.default);
  app.use('/user', _user.default);
  app.use('/book', _book.default);
  app.use('/carModel', _carModel.default);
  app.use('/car', _car.default);
  app.use('/hub', _hub.default);
  app.use('/rating', _rating.default);
  app.use('/extra', _extra.default);
  app.use('/payment', _payment.default);
  app.use('/rental', _rental.default);
  app.use('/account', _account.default);
  app.use('/customer', _customer.default);
  app.use('/employee', _employee.default);
  app.use('/manager', _manager.default);
  app.use('/license', _license.default);
};

exports.default = _default;