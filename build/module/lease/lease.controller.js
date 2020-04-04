"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitTransaction = exports.updateLease = exports.addLease = exports.getLease = exports.getLeaseList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _moment = _interopRequireDefault(require("moment"));

var _lease = _interopRequireDefault(require("./lease.model"));

var _transaction = _interopRequireDefault(require("../transaction/transaction.model"));

var _log = _interopRequireDefault(require("../log/log.model"));

var _car = _interopRequireDefault(require("../car/car.model"));

var _notification = require("../../utils/notification");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLeaseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    let leases;
    let total;

    switch (req.user.role) {
      case 'CUSTOMER':
        leases = await _lease.default.find({
          customer: req.customer._id
        }).skip(skip).limit(limit).populate('car hub').populate({
          path: 'car',
          populate: {
            path: 'carModel customer'
          }
        });
        total = await _lease.default.countDocuments({
          customer: req.customer._id
        });
        break;

      case 'EMPLOYEE':
        leases = await _lease.default.find({
          hub: req.employee.hub
        }).skip(skip).limit(limit).populate('car hub').populate({
          path: 'car',
          populate: {
            path: 'carModel customer'
          }
        });
        total = await _lease.default.count({
          hub: req.employee.hub
        });
        break;

      case 'MANAGER':
        leases = await _lease.default.find().skip(skip).limit(limit).populate('car hub').populate({
          path: 'car',
          populate: {
            path: 'carModel customer'
          }
        });
        total = await _lease.default.count();
        break;

      default:
        throw new Error('Role is not existed!');
    }

    return res.status(_httpStatus.default.OK).json({
      leases,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getLeaseList = getLeaseList;

const getLease = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const lease = await _lease.default.findById(id).populate('car hub').populate({
      path: 'car',
      populate: {
        path: 'carModel customer'
      }
    });

    if (!lease) {
      throw new Error('Lease Not found');
    }

    return res.status(_httpStatus.default.OK).json(lease.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getLease = getLease;

const addLease = async (req, res) => {
  try {
    const lease = await _lease.default.create(req.body);
    await _log.default.create({
      type: 'CREATE',
      title: 'Create lease request',
      detail: lease._id
    });
    return res.status(_httpStatus.default.CREATED).json(lease);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addLease = addLease;

const updateLease = async (req, res) => {
  try {
    const {
      data,
      log
    } = req.body;
    const lease = await _lease.default.findById(req.params.id);
    Object.keys(data).forEach(key => {
      lease[key] = data[key];
    });
    await lease.save();
    await _log.default.create({
      detail: lease._id,
      ...log
    });
    return res.status(_httpStatus.default.OK).json(lease);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};
/*

    'PENDING',
        'UPCOMING',
        'DECLINE',
        'AVAILABLE',
        'HIRING',
        'WAIT_TO_RETURN',
        'PAST', */


exports.updateLease = updateLease;

const submitTransaction = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      toStatus,
      message
    } = req.body;
    let log = {};
    let notificationData = {};
    const lease = await _lease.default.findById(id).populate({
      path: 'car hub'
    }).populate({
      path: 'car',
      populate: {
        path: 'customer'
      }
    });

    if (!lease || !lease.isActive) {
      throw new Error('lease not found');
    }

    const {
      fcmToken
    } = lease.car.customer; // 'PENDING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'

    const {
      status
    } = lease;

    switch (status) {
      case 'PENDING':
        lease.status = toStatus;

        if (toStatus === 'ACCEPTED') {
          log = {
            type: 'ACCEPTED',
            title: 'Request accepted by hub'
          };
          notificationData = {
            title: 'Your lease request has been accepted',
            body: `Thank you for using our service, please drive your car to ${lease.hub.address} at ${(0, _moment.default)(lease.startDate).format('MMM DD YYYY')}.`
          };
        } else {
          log = {
            type: 'DECLINE',
            title: 'Request decline by hub'
          };
          lease.message = message;
          notificationData = {
            title: 'Your lease request has been declined',
            body: 'Sorry, but for some reason, your lease request has been declined. Click here to see more information'
          };
        }

        (0, _notification.sendNotification)({ ...notificationData,
          data: {
            action: 'NAVIGATE',
            screenName: 'RentHistoryItemDetailScreen'
          },
          fcmToken
        });
        break;

      case 'AVAILABLE':
      case 'WAIT_TO_RETURN':
        lease.status = toStatus;

        if (toStatus === 'PAST') {
          log = {
            type: 'TAKE_BACK',
            title: 'Take car at hub'
          };
        }

        if (toStatus === 'HIRING') {
          log = {
            type: 'SOME_ONE_RENT_YOUR_CAR',
            title: 'Rented by someone'
          };
          (0, _notification.sendNotification)({
            title: 'Your car has been rented',
            body: 'Congratulation! Some one has rented your car. Click here to see how much you earn',
            fcmToken,
            data: {
              action: 'NAVIGATE',
              screenName: 'RentHistoryItemDetailScreen',
              screenProps: {
                selectedId: lease._id
              }
            }
          });
        }

        break;

      case 'ACCEPTED':
        lease.status = 'AVAILABLE';
        log = {
          type: 'PLACING',
          title: 'Placing car at hub'
        };
        (0, _notification.sendNotification)({
          title: 'Placing car successfully',
          body: 'You have placed your car at the hub. Thank you for using our service',
          fcmToken
        });
        break;

      default:
        break;
    }

    await lease.save();

    if (log) {
      await _log.default.create({
        detail: lease._id,
        ...log
      });
    }

    return res.status(_httpStatus.default.OK).json(lease);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.submitTransaction = submitTransaction;