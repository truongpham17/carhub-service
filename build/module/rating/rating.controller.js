"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeRating = exports.updateRating = exports.createRating = exports.getRatingById = exports.getRatingList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _rating = _interopRequireDefault(require("./rating.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRatingList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const ratings = await _rating.default.find().limit(limit).skip(skip);
    const total = await _rating.default.count();
    return res.status(_httpStatus.default.OK).json({
      ratings,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getRatingList = getRatingList;

const getRatingById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rating = await _rating.default.findById({
      _id: id
    });

    if (!rating) {
      throw new Error('Rating not found!');
    }

    return res.status(_httpStatus.default.OK).json({
      rating
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getRatingById = getRatingById;

const createRating = async (req, res) => {
  try {
    const rating = await _rating.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json({
      msg: 'Created successfully!',
      rating
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createRating = createRating;

const updateRating = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const rating = await _rating.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Update successfully!',
      rating
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.updateRating = updateRating;

const removeRating = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _rating.default.findByIdAndUpdate({
      _id: id
    });
    return res.json(_httpStatus.default.OK).json({
      msg: 'Deteled successfully!'
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.removeRating = removeRating;