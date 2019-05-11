'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = undefined;

let report = exports.report = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const { start, end } = req.query;
    const months = (0, _time.getMonthsInRange)(start, end);
    try {
      const list = yield _bill2.default.find({
        isRemoved: false,
        isReturned: false,
        createdAt: {
          "$gte": (0, _moment2.default)(start).startOf('day').toDate(),
          "$lte": (0, _moment2.default)(end).endOf('day').toDate()
        }
      }).populate({
        path: 'productList.product',
        populate: {
          path: 'store'
        }
      });
      let totalSoldMoney = 0;
      list.forEach(function (item) {
        item.productList.forEach(function (prod) {
          totalSoldMoney += (prod.product.exportPrice - prod.discount) * prod.quantity;
        });
      });
      const billCount = yield _bill2.default.count({ isRemoved: false });

      const reportByTime = [];
      yield Promise.all(months.map((() => {
        var _ref2 = _asyncToGenerator(function* (month) {
          const billList = yield _bill2.default.find({
            isReturned: false,
            isRemoved: false,
            createdAt: {
              "$gte": (0, _moment2.default)(month, 'MM/YYYY').startOf('month').toDate(),
              "$lte": (0, _moment2.default)(month, 'MM/YYYY').endOf('month').toDate()
            }
          }).populate('productList.product');
          let monthSoldMoney = 0;
          billList.forEach(function (item) {
            item.productList.forEach(function (prod) {
              monthSoldMoney += (prod.product.exportPrice - prod.discount) * prod.quantity;
            });
          });
          reportByTime.push({
            time: month,
            total: monthSoldMoney
          });
        });

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      })()));

      let reportByStore = [];
      list.forEach(function (item) {
        let soldMoney = 0;
        item.productList.forEach(function (prod) {
          const soldMoney = (prod.product.exportPrice - prod.discount) * prod.quantity;
          if (reportByStore.find(function (i) {
            return i.store._id === prod.product.store._id;
          })) {
            reportByStore = reportByStore.map(function (rp) {
              return rp.store._id === prod.product.store._id ? Object.assign({}, rp, { total: rp.total + soldMoney }) : rp;
            });
          } else {
            reportByStore.push({
              store: prod.product.store,
              total: soldMoney
            });
          }
        });
      });

      return res.status(_httpStatus2.default.OK).json({
        // list,
        billCount,
        reportByTime,
        reportByStore,
        totalSoldMoney
      });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function report(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bill = require('../bill/bill.model');

var _bill2 = _interopRequireDefault(_bill);

var _store = require('../store/store.model');

var _store2 = _interopRequireDefault(_store);

var _time = require('../../utils/time');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }