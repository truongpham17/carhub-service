"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acceptRentalSharingRequest = exports.declineRentalSharingRequest = exports.deleteRentalSharingRequest = exports.updateRentalSharingRequest = exports.addRentalSharingRequest = exports.getRentalRequestBySharing = exports.getRentalSharingByCustomer = exports.getRentalSharingRequest = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _rentalSharingRequest = _interopRequireDefault(require("./rentalSharingRequest.model"));

var _sharing = _interopRequireDefault(require("../sharing/sharing.model"));

var _notification = require("../../utils/notification");

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
    const {
      id
    } = req.params;
    const requestList = await _rentalSharingRequest.default.find({
      sharing: id,
      isActive: true
    }).populate('customer');
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
    console.log('sharing: ', sharingObj);

    if (!sharingObj) {
      throw new Error('Cannot find sharing');
    }

    if (sharingObj.customer) {
      throw new Error('This sharing already transfer');
    }

    const rentalRequest = await _rentalSharingRequest.default.create(req.body);
    (0, _notification.sendNotification)({
      fcmToken: sharingObj.rental.customer.fcmToken,
      title: 'Some one want to hire your car',
      body: 'Click here to see detail request, and accept transfer your car',
      data: {
        action: 'NAGIGATE',
        screenName: 'RentSharingRequestScreen',
        // screenProps: {
        selectedId: sharingObj.rental._id.toString() // },

      }
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
    const rentalSharingRequest = await _rentalSharingRequest.default.findById(id).populate('customer');

    if (!rentalSharingRequest) {
      throw new Error('Can not find rental sharing request');
    }

    rentalSharingRequest.status = 'DECLINED';
    (0, _notification.sendNotification)({
      title: 'Your request has been declined',
      fcmToken: rentalSharingRequest.customer.fcmToken,
      data: {
        screenName: 'HistoryStack',
        action: 'NAVIGATE'
      }
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
    } = req.params; // const { acceptedId } = req.body;

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

    const rentalSharingRequests = (await _rentalSharingRequest.default.find({
      sharing: sharing._id
    }).populate('customer')) || [];

    for (let i = 0; i < rentalSharingRequests.length; i++) {
      const rentalSharing = rentalSharingRequests[i];

      if (rentalSharing._id === id) {
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
      } else {
        (0, _notification.sendNotification)({
          title: 'Your request has been declined',
          fcmToken: rentalSharing.customer.fcmToken,
          data: {
            screenName: 'HistoryStack',
            action: 'NAVIGATE'
          }
        });
        rentalSharing.status = 'DECLINED';
        await rentalSharing.save();
      }
    }
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.acceptRentalSharingRequest = acceptRentalSharingRequest;