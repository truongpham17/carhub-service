"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSharing = exports.updateSharing = exports.createSharingFromRental = exports.addSharing = exports.getSharingById = exports.removeLatestSharingByRental = exports.confirmSharing = exports.getLatestSharingByRental = exports.getSharingByRentalId = exports.suggestSharing = exports.getSharing = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _sharing = _interopRequireDefault(require("./sharing.model"));

var _rentalSharingRequest = _interopRequireDefault(require("../rental-sharing-request/rentalSharingRequest.model"));

var _rental = _interopRequireDefault(require("../rental/rental.model"));

var _distance = require("../../utils/distance");

var _errorCode = require("../../constant/errorCode");

var _log = _interopRequireDefault(require("../log/log.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getSharing = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const sharings = await _sharing.default.find({}).skip(skip).limit(limit);
    const total = await _sharing.default.countDocuments({});
    return res.status(_httpStatus.default.OK).json({
      sharings,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getSharing = getSharing;

const suggestSharing = async (req, res) => {
  try {
    const {
      _id: customer
    } = req.customer;

    if (!customer) {
      throw new Error('Access denied');
    }

    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const {
      startLocation,
      endLocation,
      startDate,
      endDate
    } = req.body;
    const {
      lat: startLat,
      lng: startLng
    } = startLocation.geometry;
    const {
      lat: endLat,
      lng: endLng
    } = endLocation.geometry;
    const sharings = await _sharing.default.find({
      isActive: true,
      customer: null,
      fromDate: {
        $lte: startDate
      },
      toDate: {
        $gte: endDate
      }
    }).skip(skip).limit(limit).populate('rental customer sharingRequest').populate({
      path: 'rental',
      populate: {
        path: 'carModel customer pickoffHub'
      }
    }).populate({
      path: 'sharingRequest',
      populate: {
        path: 'customer'
      }
    }); // only show result if the startLocation near the pickup location, endLocation near return hub

    const sharingFilterDistance = sharings.filter(sharing => // check start location and pickup location
    (0, _distance.distanceInKmBetweenEarthCoordinates)(startLat, startLng, sharing.geometry.lat, sharing.geometry.lng) < 30).filter(sharing => {
      const {
        geometry
      } = sharing.rental.pickoffHub;
      return (// distance between pick-off location and pick-off hub location
        (0, _distance.distanceInKmBetweenEarthCoordinates)(endLat, endLng, geometry.lat, geometry.lng) < 30
      );
    }).filter(item => item.rental.customer._id !== customer).map(sharing => ({ ...sharing.toJSON(),
      distance: (0, _distance.distanceInKmBetweenEarthCoordinates)(startLat, startLng, sharing.geometry.lat, sharing.geometry.lng)
    }));
    return res.status(_httpStatus.default.OK).json(sharingFilterDistance);
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.suggestSharing = suggestSharing;

const getSharingByRentalId = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const sharing = await _sharing.default.find({
      rental: id,
      isActive: true
    }).populate('rental customer sharingRequest').populate({
      path: 'rental',
      populate: {
        path: 'carModel customer pickoffHub'
      }
    }).populate({
      path: 'sharingRequest',
      populate: {
        path: 'customer'
      }
    });
    return res.status(_httpStatus.default.OK).json(sharing);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getSharingByRentalId = getSharingByRentalId;

const getLatestSharingByRental = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const sharings = await _sharing.default.find({
      rental: id,
      isActive: true
    }).sort({
      createdAt: -1
    }).populate('rental customer').populate({
      path: 'rental',
      populate: {
        path: 'carModel customer pickoffHub'
      }
    });

    if (!Array.isArray(sharings) || sharings.length === 0) {
      return res.status(_httpStatus.default.NO_CONTENT).json({});
    }

    return res.status(_httpStatus.default.OK).json(sharings[0]);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getLatestSharingByRental = getLatestSharingByRental;

const confirmSharing = async (req, res) => {
  try {
    // id of rental
    const {
      id
    } = req.params;
    const {
      sharingRequestId
    } = req.body;
    const rental = await _rental.default.findById(id);

    if (!rental) {
      throw new Error('Cannot find rental!');
    }

    const sharings = await _sharing.default.find({
      rental: id,
      isActive: true
    }).sort({
      createdAt: -1
    });

    if (!Array.isArray(sharings) || sharings.length === 0) {
      throw new Error('Can not find sharing');
    }

    const sharing = sharings[0];
    const sharingRequest = await _rentalSharingRequest.default.findOne({
      sharing: sharing._id,
      status: 'ACCEPTED'
    });

    if (!sharingRequest) {
      throw new Error('Cannot find sharing request');
    }

    if (sharingRequest._id.toString() !== sharingRequestId) {
      throw new Error('Sharing request id does not match!');
    }

    sharing.sharingRequest = sharingRequest;
    sharing.customer = sharingRequest.customer;
    rental.status = 'SHARED';
    sharingRequest.status = 'CURRENT';
    await sharingRequest.save();
    await rental.save();
    await sharing.save();
    return res.status(_httpStatus.default.OK).json({});
  } catch (error) {
    console.log(error.message);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.confirmSharing = confirmSharing;

const removeLatestSharingByRental = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const sharing = await _sharing.default.find({
      rental: id,
      isActive: true
    }).sort({
      createdAt: -1
    }).populate('rental customer').populate({
      path: 'rental',
      populate: {
        path: 'carModel customer pickoffHub'
      }
    });
    const latest = sharing[0];
    latest.isActive = false;
    await latest.save();
    return res.status(_httpStatus.default.OK).json(latest);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.removeLatestSharingByRental = removeLatestSharingByRental;

const getSharingById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const sharing = await _sharing.default.findById(id).populate('rental');
    return res.status(_httpStatus.default.OK).json(sharing);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getSharingById = getSharingById;

const addSharing = async (req, res) => {
  try {
    const sharing = await _sharing.default.create(req.body);
    return res.status(_httpStatus.default.OK).json(sharing);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.addSharing = addSharing;

const createSharingFromRental = async (req, res) => {
  try {
    const {
      rental,
      price,
      fromDate,
      toDate
    } = req.body;
    const rentalObj = await _rental.default.findById(rental);

    if (!rentalObj) {
      throw new Error(_errorCode.SHARING_RENTAL_NOT_FOUND);
    }

    rentalObj.status = 'SHARING';
    const sharing = await _sharing.default.create(req.body);
    await _log.default.create({
      type: 'CREATE_SHARING',
      title: 'Request sharing car',
      detail: rental,
      note: `${price}-${fromDate}-${toDate}`
    });
    await rentalObj.save();
    return res.status(_httpStatus.default.CREATED).json(sharing.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createSharingFromRental = createSharingFromRental;

const updateSharing = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const sharing = await _sharing.default.findById(id);
    Object.keys(req.body).forEach(key => sharing[key] = req.body[key]);
    await sharing.save();
    return res.status(_httpStatus.default.OK).json(sharing);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.updateSharing = updateSharing;

const removeSharing = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const sharing = await _sharing.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json(sharing);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.removeSharing = removeSharing;