"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitTransaction = exports.removeRental = exports.updateRental = exports.addRental = exports.getRentalById = exports.getRental = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _rental = _interopRequireDefault(require("./rental.model"));

var _log = _interopRequireDefault(require("../log/log.model"));

var _transaction = _interopRequireDefault(require("../transaction/transaction.model"));

var _notification = require("../../utils/notification");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    let rentals;
    let total;

    switch (req.user.role) {
      case 'CUSTOMER':
        rentals = await _rental.default.find({
          customer: req.customer._id
        }).skip(skip).limit(limit).sort({
          updatedAt: -1
        }).populate('car customer leaser pickupHub pickoffHub payment carModel').populate({
          path: 'car',
          populate: {
            path: 'carModel'
          }
        });
        total = await _rental.default.countDocuments({
          customer: req.customer._id
        });
        break;

      case 'EMPLOYEE':
        rentals = await _rental.default.find({
          pickupHub: req.employee.hub,
          status: 'UPCOMING'
        }).skip(skip).limit(limit).populate('car customer leaser pickupHub pickoffHub payment carModel').populate({
          path: 'car',
          populate: {
            path: 'carModel'
          }
        });
        total = await _rental.default.countDocuments();
        break;

      case 'MANAGER':
        rentals = await _rental.default.find().skip(skip).limit(limit).populate('car customer leaser pickupHub pickoffHub payment carModel').populate({
          path: 'car',
          populate: {
            path: 'carModel'
          }
        });
        total = await _rental.default.countDocuments();
        break;

      default:
        throw new Error('Role is not existed!');
    }

    return res.status(_httpStatus.default.OK).json({
      rentals,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getRental = getRental;

const getRentalById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rental = await _rental.default.findById(id).populate('car customer leaser pickupHub pickoffHub payment carModel');
    return res.status(_httpStatus.default.OK).json(rental);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getRentalById = getRentalById;

const addRental = async (req, res) => {
  try {
    const rental = await _rental.default.create(req.body);
    await _log.default.create({
      type: 'CREATE',
      title: 'Create rental request',
      detail: rental._id
    });
    return res.status(_httpStatus.default.CREATED).json(rental.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addRental = addRental;

const updateRental = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      data,
      log
    } = req.body;
    const rental = await _rental.default.findById(id);
    Object.keys(data).forEach(key => {
      rental[key] = data[key];
    });
    await rental.save();
    await _log.default.create({
      detail: rental._id,
      ...log
    });
    return res.status(_httpStatus.default.OK).json(rental);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.updateRental = updateRental;

const removeRental = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rental = await _rental.default.findByIdAndDelete({
      _id: id
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Deleted!!',
      rental
    });
  } catch (err) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(err);
  }
};

exports.removeRental = removeRental;

const submitTransaction = async (req, res) => {
  try {
    const {
      id
    } = req.params; // if (!req.employee) throw new Error('Permission denied!');

    const rental = await _rental.default.findById(id).populate('customer');
    const {
      fcmToken
    } = rental.customer;

    if (!rental) {
      throw new Error('Rental not found');
    } // 'UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'


    const {
      status
    } = rental;
    const {
      toStatus,
      car
    } = req.body;
    let log = {};

    switch (status) {
      case 'UPCOMING':
        rental.status = 'CURRENT';
        log = {
          type: 'RECEIVE',
          title: 'Take car at hub'
        };
        rental.car = car;
        break;

      case 'CURRENT':
        rental.status = toStatus;

        if (toStatus === 'SHARING') {
          log = {
            type: 'CREATE_SHARING',
            title: 'Request sharing car'
          };
        }

        if (toStatus === 'PAST') {
          log = {
            type: 'RETURN',
            title: 'Return car'
          };
        }

        break;

      case 'OVERDUE':
        rental.status = 'PAST';
        log = {
          type: 'RETURN',
          title: 'Return car'
        };
        break;

      case 'SHARING':
        rental.status = toStatus;

        if (toStatus === 'SHARED') {
          (0, _notification.sendNotification)({
            title: 'Sharing request',
            body: 'Someone has requested to take your sharing car. Click to see more information',
            fcmToken,
            data: {
              action: 'NAVIGATE',
              screenName: 'LeaseHistoryItemDetailScreen',
              screenProps: {
                selectedId: rental._id
              }
            }
          });
          log = {
            type: 'CONFIRM_SHARING',
            title: 'Confirm sharing car'
          };
        }

        if (toStatus === 'CURRENT') {
          log = {
            type: 'CANCEL_SHARING',
            title: 'Cancel sharing car'
          };
        }

        break;

      default:
        break;
    }

    await rental.save();

    if (log) {
      await _log.default.create({
        detail: rental._id,
        ...log
      });
    }

    return res.status(_httpStatus.default.OK).json(rental);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.submitTransaction = submitTransaction;