"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelSharing = exports.submitTransaction = exports.removeRental = exports.updateRental = exports.addRental = exports.getRentalById = exports.getRental = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _rental = _interopRequireDefault(require("./rental.model"));

var _log = _interopRequireDefault(require("../log/log.model"));

var _car = _interopRequireDefault(require("../car/car.model"));

var _notification = require("../../utils/notification");

var _notification2 = _interopRequireDefault(require("../notification/notification.model"));

var _rentalSharingRequest = _interopRequireDefault(require("../rental-sharing-request/rentalSharingRequest.model"));

var _sharing = _interopRequireDefault(require("../sharing/sharing.model"));

var _lease = _interopRequireDefault(require("../lease/lease.model"));

var _paypal = require("../../service/paypal");

var _transaction = _interopRequireDefault(require("../transaction/transaction.model"));

var _errorCode = require("../../constant/errorCode");

var _policy = require("../../constant/policy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    let rentals;
    let total;
    console.log(req.user);

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
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getRental = getRental;

const getRentalById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rental = await _rental.default.findById(id).populate('car customer leaser pickupHub pickoffHub payment carModel').populate({
      path: 'car',
      populate: {
        path: 'carModel'
      }
    });
    return res.status(_httpStatus.default.OK).json(rental);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getRentalById = getRentalById;

const addRental = async (req, res) => {
  try {
    const {
      nonce,
      ...rentalData
    } = req.body;
    console.log(rentalData);
    console.log(nonce);
    const rental = await _rental.default.create(rentalData);
    await _transaction.default.create({
      sender: req.customer._id,
      receiver: req.pickupHub,
      amount: 900,
      type: 'RENTAL'
    }); // const saleRequest = {
    //   amount: '900.00',
    //   paymentMethodNonce: nonce,
    //   options: {
    //     submitForSettlement: true,
    //   },
    //   customerId: '"PDHMDYZCE43AU"',
    // };
    // const transaction = await gateway.transaction.sale(saleRequest);
    // console.log(transaction);

    await _log.default.create({
      type: 'CREATE',
      title: 'Create rental request',
      detail: rental._id
    });
    return res.status(_httpStatus.default.CREATED).json(rental.toJSON());
  } catch (error) {
    console.log(error);
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

    if (!rental) {
      throw new Error(_errorCode.RENTAL_NOT_FOUND_RENTAL);
    }

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
    let carObj;
    let lease;
    let rentalDuplicate;

    switch (status) {
      case 'UPCOMING':
        if (toStatus !== 'CURRENT') {
          rental.numberDeclined = rental.numberDeclined ? rental.numberDeclined + 1 : 1;
          await _log.default.create({
            type: 'CANCEL_TAKE_CAR',
            title: 'Not accept taking car',
            detail: rental._id
          });
          await rental.save();
          return res.status(_httpStatus.default.OK).json({});
        }

        rental.status = 'CURRENT';
        log = {
          type: 'RECEIVE',
          title: 'Take car at hub'
        };
        carObj = await _car.default.findById(car);

        if (!carObj) {
          throw new Error(_errorCode.RENTAL_NOT_FOUND_CAR);
        }

        if (carObj.carModel.toString() !== rental.carModel.toString()) {
          throw new Error(_errorCode.RENTAL_NOT_MATCH_CAR_MODEL);
        }

        rentalDuplicate = await _rental.default.findOne({
          car,
          status: {
            $in: ['CURRENT', 'SHARING', 'SHARED']
          }
        });

        if (rentalDuplicate) {
          throw new Error(_errorCode.RENTAL_CAR_ALREADY_IN_USE);
        }

        rental.car = car;
        carObj = await _car.default.findById(car).populate('customer');
        carObj.currentHub = null; // Notification.create({
        //   customer: rental.customer._id,
        //   navigatorData: {
        //     screenName: 'RentHistoryItemDetailScreen',
        //     selectedId: rental._id,
        //   },
        //   detail: [
        //     {
        //       type: 'normal',
        //       value: 'Successfully take the ',
        //     },
        //     {
        //       type: 'bold',
        //       value: rental.car.carModel.name,
        //     },
        //     {
        //       type: 'normal',
        //       value: ` car.`,
        //     },
        //   ],
        // });

        lease = await _lease.default.findOne({
          car,
          status: 'AVAILABLE'
        }).populate('customer'); // neu day la leasing car -> notify user

        if (lease) {
          (0, _notification.sendNotification)({
            title: 'Your car has been rent',
            body: `Congratulation! Your car has been rent by someone, you just earned $${rental.totalCost * _policy.LEASE_PRICE_PERCENTAGE}.`,
            fcmToken: carObj.customer.fcmToken,
            data: {
              screenName: 'LeaseHistoryItemDetailScreen',
              selectedId: lease._id.toString(),
              action: 'NAVIGATE'
            }
          }); // Notification.create({
          //   customer: lease.customer._id,
          //   navigatorData: {
          //     screenName: 'LeaseHistoryItemDetailScreen',
          //     selectedId: lease._id,
          //   },
          //   detail: [
          //     {
          //       type: 'normal',
          //       value: 'Your car ',
          //     },
          //     {
          //       type: 'bold',
          //       value: rental.car.carModel.name,
          //     },
          //     {
          //       type: 'normal',
          //       value: ` has been rented. Your earn ${rental.totalCost *
          //         LEASE_PRICE_PERCENTAGE}`,
          //     },
          //   ],
          // });

          await _log.default.create({
            type: 'SOME_ONE_RENT_YOUR_CAR',
            title: 'Rented by someone',
            detail: lease._id,
            note: rental.totalCost * _policy.LEASE_PRICE_PERCENTAGE
          });
          lease.totalEarn += rental.totalCost * _policy.LEASE_PRICE_PERCENTAGE;
          lease.status = 'HIRING';
        }

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
          carObj = await _car.default.findById(rental.car);
          carObj.currentHub = rental.pickoffHub;
          log = {
            type: 'RETURN',
            title: 'Return car'
          };
        }

        lease = await _lease.default.findOne({
          car: rental.car,
          status: 'SHARING'
        });

        if (lease) {
          lease.status = 'AVAILABEL';
        }

        break;

      case 'OVERDUE':
        rental.status = 'PAST';
        log = {
          type: 'RETURN',
          title: 'Return car'
        };
        lease = await _lease.default.findOne({
          car: rental.car,
          status: 'SHARING'
        });

        if (lease) {
          lease.status = 'AVAILABEL';
        }

        break;

      case 'SHARING':
        rental.status = toStatus;

        if (toStatus === 'SHARED') {
          (0, _notification.sendNotification)({
            title: 'Sharing request',
            body: 'Success transfer car',
            fcmToken,
            data: {
              action: 'NAVIGATE',
              screenName: 'RentHistoryItemDetailScreen',
              screenProps: {
                selectedId: rental._id.toString()
              }
            }
          });

          _notification2.default.create({
            customer: lease.car.customer._id,
            navigatorData: {
              screenName: 'RentHistoryItemDetailScreen',
              selectedId: lease._id
            },
            detail: [{
              type: 'normal',
              value: 'Success transfer your rental car'
            }]
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

    if (lease) {
      await lease.save();
    }

    if (carObj) {
      await carObj.save();
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
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.submitTransaction = submitTransaction;

const cancelSharing = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rental = await _rental.default.findById(id);

    if (!rental) {
      throw new Error(_errorCode.SHARING_RENTAL_NOT_FOUND);
    }

    if (rental.status !== 'SHARING') {
      throw new Error(_errorCode.SHARING_RENTAL_NOT_SHARING);
    }

    rental.status = 'CURRENT';
    const sharings = await _sharing.default.find({
      rental: rental._id,
      isActive: true
    }).sort({
      createdAt: -1
    });

    if (!Array.isArray(sharings) || sharings.length === 0) {
      throw new Error(_errorCode.SHARING_RENTAL_NOT_SHARING);
    }

    const lastestSharing = sharings[0]; // remove lastest sharing

    lastestSharing.isActive = false;
    const sharingRequests = await _rentalSharingRequest.default.find({
      sharing: lastestSharing._id,
      status: {
        $in: ['PENDING', 'ACCEPTED']
      },
      isActive: true
    }).populate('customer'); // notify all user

    if (Array.isArray(sharingRequests) && sharingRequests.length > 0) {
      sharingRequests.forEach(async request => {
        (0, _notification.sendNotification)({
          fcmToken: request.customer.fcmToken,
          title: 'The sharing car is not available',
          body: "The owner's car of your request has cancelled the sharing. Please try to hire another car"
        });
        request.isActive = false;
        await request.save();
      });
    }

    await _log.default.create({
      type: 'CANCEL_SHARING',
      title: 'Cancel sharing car',
      detail: id
    });
    await rental.save();
    await lastestSharing.save();
    return res.status(_httpStatus.default.OK).json({});
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.cancelSharing = cancelSharing;