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

var _license = _interopRequireDefault(require("./license/license.routes"));

var _manager = _interopRequireDefault(require("./manager/manager.routes"));

var _user = _interopRequireDefault(require("./user/user.routes"));

var _extra = _interopRequireDefault(require("./extra/extra.routes"));

var _payment = _interopRequireDefault(require("./payment/payment.routes"));

var _rental = _interopRequireDefault(require("./rental/rental.routes"));

var _lease = _interopRequireDefault(require("./lease/lease.routes"));

var _notification = _interopRequireDefault(require("./notification/notification.routes"));

var _sharing = _interopRequireDefault(require("./sharing/sharing.routes"));

var _transaction = _interopRequireDefault(require("./transaction/transaction.routes"));

var _log = _interopRequireDefault(require("./log/log.routes"));

var _transfer = _interopRequireDefault(require("./transfer/transfer.routes"));

var _rentalSharingRequest = _interopRequireDefault(require("./rental-sharing-request/rentalSharingRequest.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = app => {
  app.use('/user', _user.default);
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
  app.use('/lease', _lease.default);
  app.use('/license', _license.default);
  app.use('/sharing', _sharing.default);
  app.use('/transaction', _transaction.default);
  app.use('/log', _log.default);
  app.use('/transfer', _transfer.default);
  app.use('/rentalSharingRequest', _rentalSharingRequest.default);
  app.use('/notification', _notification.default);
};

exports.default = _default;