"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acceptRentalSharingRequest = exports.declineRentalSharingRequest = exports.deleteRentalSharingRequest = exports.updateRentalSharingRequest = exports.addRentalSharingRequest = exports.getRentalRequestBySharing = exports.getRentalSharingByCustomer = exports.getRentalSharingRequest = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _rentalSharingRequest = _interopRequireDefault(require("./rentalSharingRequest.model"));

var _sharing = _interopRequireDefault(require("../sharing/sharing.model"));

var _notification = require("../../utils/notification");

var _notification2 = _interopRequireDefault(require("../notification/notification.model"));

var _rental = _interopRequireDefault(require("../rental/rental.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRentalSharingRequest = async (req, res) => {
  try {
    const requestList = await _rentalSharingRequest.default.find({
      isActive: true
    }).populate('customer sharing').populate({
      path: 'sharing',
      populate: {
        path: 'rental'
      }
    });
    return res.status(_httpStatus.default.OK).json(requestList);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getRentalSharingRequest = getRentalSharingRequest;

const getRentalSharingByCustomer = async (req, res) => {
  try {
    if (!req.customer) {
      throw new Error('Not user!');
    }

    const requestList = await _rentalSharingRequest.default.find({
      isActive: true,
      customer: req.customer._id,
      status: {
        $in: ['ACCEPTED', 'PENDING', 'CURRENT']
      }
    }).populate('customer sharing').populate({
      path: 'sharing',
      populate: {
        path: 'rental'
      }
    }).populate({
      path: 'sharing',
      populate: {
        path: 'rental',
        populate: {
          path: 'carModel customer car'
        }
      }
    });
    return res.status(_httpStatus.default.OK).json(requestList);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getRentalSharingByCustomer = getRentalSharingByCustomer;

const getRentalRequestBySharing = async (req, res) => {
  try {
    /**
     * @param id: sharing id
     */
    const {
      id
    } = req.params;
    const requestList = await _rentalSharingRequest.default.find({
      sharing: id,
      isActive: true
    }).populate('customer sharing');
    return res.status(_httpStatus.default.OK).json(requestList);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getRentalRequestBySharing = getRentalRequestBySharing;

const addRentalSharingRequest = async (req, res) => {
  try {
    const {
      sharing
    } = req.body;
    const sharingObj = await _sharing.default.findById(sharing).populate('rental').populate({
      path: 'rental',
      populate: {
        path: 'customer'
      }
    });

    if (!sharingObj) {
      throw new Error('Cannot find sharing');
    }

    if (sharingObj.customer) {
      throw new Error('This sharing already transfer');
    }

    const rentalRequest = await (await _rentalSharingRequest.default.create(req.body)).populate('customer');
    (0, _notification.sendNotification)({
      fcmToken: sharingObj.rental.customer.fcmToken,
      title: 'Some one want to hire your car',
      body: 'Click here to see detail request, and accept transfer your car',
      data: {
        action: 'NAVIGATE',
        screenName: 'SharingInformationScreen',
        selectedId: sharingObj.rental._id.toString(),
        newId: rentalRequest._id.toString()
      }
    });

    _notification2.default.create({
      customer: sharingObj.rental.customer._id,
      actor: rentalRequest.customer._id,
      navigatorData: {
        screenName: 'RentHistoryItemDetailScreen',
        selectedId: sharingObj.rental._id
      },
      detail: [{
        detailType: 'bold',
        value: rentalRequest.customer.fullName
      }, {
        detailType: 'normal',
        value: ' request taking your sharing car'
      }]
    });

    return res.status(_httpStatus.default.OK).json(rentalRequest);
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.addRentalSharingRequest = addRentalSharingRequest;

const updateRentalSharingRequest = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const requestList = await _rentalSharingRequest.default.findById(id);
    Object.keys(req.body).forEach(key => requestList[key] = req.body[key]);
    await requestList.save();
    return res.status(_httpStatus.default.OK).json(requestList);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.updateRentalSharingRequest = updateRentalSharingRequest;

const deleteRentalSharingRequest = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rentalRequest = await _rentalSharingRequest.default.findByIdAndUpdate({
      _id: id,
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json(rentalRequest);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.deleteRentalSharingRequest = deleteRentalSharingRequest;

const declineRentalSharingRequest = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rentalSharingRequest = await _rentalSharingRequest.default.findById(id).populate('customer sharing');

    if (!rentalSharingRequest) {
      throw new Error('Can not find rental sharing request');
    }

    const rental = await _rental.default.findById(rentalSharingRequest.sharing.rental).polulate('carModel');
    rentalSharingRequest.status = 'DECLINED';
    (0, _notification.sendNotification)({
      title: 'Your request has been declined',
      fcmToken: rentalSharingRequest.customer.fcmToken,
      data: {
        screenName: 'HistoryStack',
        action: 'NAVIGATE'
      }
    });

    _notification2.default.create({
      customer: rentalSharingRequest.customer._id,
      navigatorData: {},
      actor: rental.customer,
      detail: [{
        detailType: 'normal',
        value: `Your request to book the sharing car ${rental.carModel.name} has been declined`
      }]
    });

    await rentalSharingRequest.save();
    return res.status(_httpStatus.default.OK).json(rentalSharingRequest.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.declineRentalSharingRequest = declineRentalSharingRequest;

const acceptRentalSharingRequest = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const acceptedRentalSharing = await _rentalSharingRequest.default.findById(id).populate('customer sharing');

    if (!acceptedRentalSharing) {
      throw new Error('Can not find rental sharing request');
    }

    const {
      sharing
    } = acceptedRentalSharing;

    if (!sharing) {
      throw new Error('Cannot find sharing!');
    }

    const rental = await _rental.default.findById(acceptedRentalSharing.sharing.rental).populate('carModel');
    const rentalSharingRequests = await _rentalSharingRequest.default.find({
      sharing: sharing._id
    }).populate('customer');

    if (Array.isArray(rentalSharingRequests) && rentalSharingRequests.length > 0) {
      rentalSharingRequests.forEach(async rentalSharing => {
        if (rentalSharing._id.toString() === id) {
          rentalSharing.status = 'ACCEPTED';
          await rentalSharing.save();
          (0, _notification.sendNotification)({
            title: 'Your request has been accepted',
            body: `Remember to come to ${sharing.address} to take your rental car`,
            fcmToken: rentalSharing.customer.fcmToken,
            data: {
              screenName: 'HistoryStack',
              action: 'NAVIGATE'
            }
          });

          _notification2.default.create({
            customer: rentalSharing.customer._id,
            navigatorData: {},
            actor: rental.customer,
            detail: [{
              detailType: 'normal',
              value: `Your request to book the sharing car ${rental.carModel.name} has been accepted`
            }]
          });
        } else if (rentalSharing.status === 'PENDING') {
          (0, _notification.sendNotification)({
            title: 'Your request has been declined',
            fcmToken: rentalSharing.customer.fcmToken,
            data: {
              screenName: 'HistoryStack',
              action: 'NAVIGATE'
            }
          });

          _notification2.default.create({
            customer: rentalSharing.customer._id,
            navigatorData: {},
            actor: rental.customer,
            detail: [{
              detailType: 'normal',
              value: `Your request to book the sharing car ${rental.carModel.name} has been declined`
            }]
          });

          rentalSharing.status = 'DECLINED';
          await rentalSharing.save();
        }
      });
    }

    return res.status(_httpStatus.default.OK).json({});
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.acceptRentalSharingRequest = acceptRentalSharingRequest;