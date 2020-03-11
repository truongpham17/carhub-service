"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCarModel = exports.updateCarModel = exports.createCarModel = exports.getCarModelByVin = exports.getCarModelById = exports.getCarModelList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _carModel = _interopRequireDefault(require("./carModel.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCarModelList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const carModels = await _carModel.default.find().skip(skip).limit(limit);
    const total = await _carModel.default.count();
    return res.status(_httpStatus.default.OK).json({
      carModels,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.getCarModelList = getCarModelList;

const getCarModelById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const carModel = await _carModel.default.findById({
      _id: id
    });
    return res.status(_httpStatus.default.OK).json({
      carModel
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.getCarModelById = getCarModelById;

const getCarModelByVin = async (req, res) => {
  try {
    const {
      vin
    } = req.params;
    const carModel = await _carModel.default.find({
      VIN: vin
    });
    return res.status(_httpStatus.default.OK).json({
      carModel
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.getCarModelByVin = getCarModelByVin;

const createCarModel = async (req, res) => {
  try {
    const carModel = await _carModel.default.create(req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Created successfully!',
      carModel
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.createCarModel = createCarModel;

const updateCarModel = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const carModel = await _carModel.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Updated successfully!',
      carModel
    });
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.updateCarModel = updateCarModel;

const removeCarModel = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _carModel.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Deleted successfully!'
    });
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.removeCarModel = removeCarModel;