'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBill = exports.returnToSupplier = exports.getBillDetail = exports.getReturnedBillList = exports.getBillList = undefined;

let getBillList = exports.getBillList = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    const search = req.query.search;
    try {
      const list = yield _bill2.default.list({ skip, limit, search });
      const total = yield _bill2.default.count({ isRemoved: false, isReturned: false, _id: new RegExp(search, 'i') });
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getBillList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getReturnedBillList = exports.getReturnedBillList = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    try {
      const list = yield _bill2.default.list({ skip, limit, isReturned: true });
      const total = yield _bill2.default.count({ isRemoved: false, isReturned: true });
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getReturnedBillList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

let getBillDetail = exports.getBillDetail = (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    try {
      const bill = yield _bill2.default.findOne({ _id: req.params.id, isRemoved: false, isReturned: false }).populate({
        path: 'productList.product',
        populate: {
          path: 'store'
        }
      });
      if (!bill) {
        return res.sendStatus(_httpStatus2.default.NOT_FOUND);
      }
      return res.status(_httpStatus2.default.OK).json((yield bill.toDetailJSON()));
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getBillDetail(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

let returnToSupplier = exports.returnToSupplier = (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    try {
      const _req$body = req.body,
            { productList } = _req$body,
            rest = _objectWithoutProperties(_req$body, ['productList']);
      yield Promise.all(productList.map((() => {
        var _ref5 = _asyncToGenerator(function* (item) {
          const product = yield _product2.default.findOne({ _id: item.product, isRemoved: false });
          if (!product) {
            throw new Error('Invalid product!');
          }
          const store = yield _store2.default.findById({ _id: product.store, isRemoved: false });
          product.quantity -= item.quantity;
          //
          product.total -= item.quantity;
          //
          store.productQuantity -= item.quantity;
          store.returnedQuantity += item.quantity;
          yield product.save();
          yield store.save();
        });

        return function (_x9) {
          return _ref5.apply(this, arguments);
        };
      })()));
      const bill = yield _bill2.default.createBill(Object.assign({
        productList
      }, rest, {
        isReturned: true
      }), req.user._id);
      return res.status(_httpStatus2.default.CREATED).json(bill);
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function returnToSupplier(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})();

let createBill = exports.createBill = (() => {
  var _ref6 = _asyncToGenerator(function* (req, res) {
    try {
      const { productList } = req.body;
      yield Promise.all(productList.map((() => {
        var _ref7 = _asyncToGenerator(function* (item) {
          const product = yield _product2.default.findOne({ _id: item.product, isRemoved: false });
          if (!product) {
            throw new Error('Invalid product!');
          }
          const store = yield _store2.default.findById({ _id: product.store, isRemoved: false });

          // Trả hàng
          if (item.isReturned) {
            // Tìm hàng trả có sẵn
            let returnedProduct = yield _product2.default.findOne({
              importPrice: product.importPrice,
              exportPrice: product.exportPrice,
              isReturned: true,
              isRemoved: false
            });
            if (returnedProduct) {
              returnedProduct.quantity += item.quantity;
              returnedProduct.total += item.quantity;
              yield returnedProduct.save();
            } else {
              returnedProduct = yield _product2.default.createProduct({
                importPrice: product.importPrice,
                exportPrice: product.exportPrice,
                store: product.store,
                quantity: item.quantity,
                total: item.quantity,
                isReturned: true
              }, req.user._id);
            }

            // product.quantity;
            product.total -= item.quantity;
            yield product.save();
            store.productQuantity += item.quantity;
          } else {
            product.quantity -= item.quantity;
            store.productQuantity -= item.quantity;
            yield product.save();
          }
          return yield store.save();
        });

        return function (_x12) {
          return _ref7.apply(this, arguments);
        };
      })()));
      const bill = yield _bill2.default.createBill(req.body, req.user._id);
      return res.status(_httpStatus2.default.CREATED).json(bill);
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function createBill(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
})();

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _bill = require('./bill.model');

var _bill2 = _interopRequireDefault(_bill);

var _store = require('../store/store.model');

var _store2 = _interopRequireDefault(_store);

var _product = require('../product/product.model');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }