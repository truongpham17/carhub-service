"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeRental = exports.updateRental = exports.addRental = exports.getRentalById = exports.getRental = void 0;

var _rental = _interopRequireDefault(require("./rental.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const rentals = await _rental.default.find({
    isActive: true
  }).skip(skip).limit(limit);
  const total = await _rental.default.countDocuments({
    isActive: true
  });
  return res.json({
    rentals,
    total
  });
};

exports.getRental = getRental;

const getRentalById = async (req, res) => {
  const {
    id
  } = req.params;
  const rental = await _rental.default.findById(id);
  return res.json(rental);
};

exports.getRentalById = getRentalById;

const addRental = async (req, res) => {
  const rental = await _rental.default.create(req.body);
  res.json(rental);
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
    return res.json({
      msg: 'Updated!',
      rental
    });
  } catch (error) {
    res.status(404).json(error);
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
    return res.json({
      msg: 'Deleted!!',
      rental
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.removeRental = removeRental;