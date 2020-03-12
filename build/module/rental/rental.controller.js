"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitTransaction = exports.removeRental = exports.updateRental = exports.addRental = exports.getRentalById = exports.getRental = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _rental = _interopRequireDefault(require("./rental.model"));

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
        }).skip(skip).limit(limit).populate('car customer leaser pickupHub pickoffHub payment carModel').populate({
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
    console.log(req.body);
    const rental = await _rental.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(rental.toJSON());
  } catch (error) {
    console.log(error, 'error herer!!');
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addRental = addRental;

const updateRental = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rental = await _rental.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Updated!',
      rental
    });
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
    const rental = await _rental.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
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
    } = req.params;
    const rental = await _rental.default.findById(id);

    if (!rental) {
      throw new Error('Rental not found');
    } // 'UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'


    const {
      status
    } = rental;

    switch (status) {
      case 'UPCOMING':
        rental.status = 'CURRENT';
        break;

      case 'CURRENT':
      case 'OVERDUE':
        rental.status = 'PAST';
        break;

      case 'SHARING':
        rental.status = 'SHARED';
        break;

      default:
        break;
    }

    await rental.save();
    return res.status(_httpStatus.default.OK).json(rental);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json();
  }
};

exports.submitTransaction = submitTransaction;