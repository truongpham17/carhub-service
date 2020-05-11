"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotification = exports.getNotifications = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _notification = _interopRequireDefault(require("./notification.model"));

var _customer = _interopRequireDefault(require("../customer/customer.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const {
      customer
    } = req;
    const list = await _notification.default.find({
      customer: customer._id.toString()
    }).populate({
      path: 'actor',
      model: _customer.default
    }).skip(skip).limit(limit);
    const total = await _notification.default.countDocuments();
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getNotifications = getNotifications;

const getNotification = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const notification = await _notification.default.findById(id);

    if (!notification) {
      throw new Error('Customer not found');
    }

    return res.status(_httpStatus.default.OK).json(notification.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getNotification = getNotification;