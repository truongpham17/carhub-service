"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePayment = exports.updatePayment = exports.createPayment = exports.getPaymentById = exports.getPayment = void 0;

var _payment = _interopRequireDefault(require("./payment.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPayment = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const payments = await _payment.default.find({
    isActive: true
  }).skip(skip).limit(limit);
  const total = await _payment.default.countDocuments({
    isActive: true
  });
  return res.json({
    payments,
    total
  });
};

exports.getPayment = getPayment;

const getPaymentById = async (req, res) => {
  const {
    id
  } = req.params;
  const payment = await _payment.default.findById(id);
  return res.json(payment);
};

exports.getPaymentById = getPaymentById;

const createPayment = async (req, res) => {
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
  return res.json(payment);
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
    return res.json({
      msg: 'Updated!',
      payment
    });
  } catch (error) {
    res.status(404).json(error);
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
    return res.json({
      msg: 'Deleted',
      payment
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.removePayment = removePayment;