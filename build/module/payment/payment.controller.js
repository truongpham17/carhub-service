"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePayment = exports.updatePayment = exports.createPayment = exports.getPaymentById = exports.getPayment = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _payment = _interopRequireDefault(require("./payment.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPayment = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const payments = await _payment.default.find({
      isActive: true
    }).skip(skip).limit(limit);
    const total = await _payment.default.countDocuments({
      isActive: true
    });
    return res.status(_httpStatus.default.OK).json({
      payments,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getPayment = getPayment;

const getPaymentById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const payment = await _payment.default.findById(id);

    if (!payment) {
      throw new Error('Payment is not found!');
    }

    return res.status(_httpStatus.default.OK).json(payment);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getPaymentById = getPaymentById;

const createPayment = async (req, res) => {
  try {
    const {
      type,
      amount,
      note
    } = req.body;
    const payment = await _payment.default.create({
      type,
      amount,
      note
    });
    return res.status(_httpStatus.default.CREATED).json(payment);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.createPayment = createPayment;

const updatePayment = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const now = new Date();
    const payment = await _payment.default.findByIdAndUpdate({
      _id: id
    }, { ...req.body,
      modifiedDate: now
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Updated!',
      payment
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.updatePayment = updatePayment;

const removePayment = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const payment = await _payment.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Deleted',
      payment
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.removePayment = removePayment;