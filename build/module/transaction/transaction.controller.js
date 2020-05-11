"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTransaction = exports.deleteTransaction = exports.addTransaction = exports.getTransaction = exports.getTransactionList = exports.getPaypalAccessToken = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _transaction = _interopRequireDefault(require("./transaction.model"));

var _paypal = require("../../service/paypal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPaypalAccessToken = async (req, res) => {
  try {
    const result = await _paypal.gateway.clientToken.generate({});
    return res.status(_httpStatus.default.OK).json({
      paymentToken: result.clientToken
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json({});
  }
};

exports.getPaypalAccessToken = getPaypalAccessToken;

const getTransactionList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const transactions = await _transaction.default.find({
      isActive: true
    }).populate('employee lease rental').populate({
      path: 'lease',
      populate: {
        path: 'customer'
      }
    }).populate({
      path: 'lease',
      populate: {
        path: 'car'
      }
    }).populate({
      path: 'lease',
      populate: {
        path: 'car',
        populate: {
          path: 'carModel'
        }
      }
    }).populate({
      path: 'rental',
      populate: {
        path: 'customer'
      }
    }).populate({
      path: 'rental',
      populate: {
        path: 'carModel'
      }
    }).skip(skip).limit(limit);
    const total = await _transaction.default.count();
    return res.status(_httpStatus.default.OK).json({
      transactions,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getTransactionList = getTransactionList;

const getTransaction = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const transaction = await _transaction.default.findById(id);

    if (!transaction) {
      throw new Error('Transaction Not found');
    }

    return res.status(_httpStatus.default.OK).json(transaction.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getTransaction = getTransaction;

const addTransaction = async (req, res) => {
  try {
    const transaction = await _transaction.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(transaction);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addTransaction = addTransaction;

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await _transaction.default.findOne({
      _id: req.params.id
    });
    transaction.isActive = false;
    await transaction.save();
    return res.status(_httpStatus.default.OK).json(transaction);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.deleteTransaction = deleteTransaction;

const updateTransaction = async (req, res) => {
  try {
    const transaction = await _transaction.default.findByIdAndUpdate({
      _id: req.params.id
    }, req.body);
    return res.status(_httpStatus.default.OK).json(transaction);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateTransaction = updateTransaction;