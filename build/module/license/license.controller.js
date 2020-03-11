"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLicense = exports.deleteLicense = exports.addLicense = exports.getLicense = exports.getLicenseList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _license = _interopRequireDefault(require("./license.model"));

var _constants = _interopRequireDefault(require("../../config/constants"));

var _customer = _interopRequireDefault(require("../customer/customer.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLicenseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const list = await _license.default.find().skip(skip).limit(limit);
    const total = await _license.default.count();
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getLicenseList = getLicenseList;

const getLicense = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const license = await _license.default.findById(id);

    if (!license) {
      throw new Error('License Not found');
    }

    return res.status(_httpStatus.default.OK).json(license.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getLicense = getLicense;

const addLicense = async (req, res) => {
  try {
    console.log(req.body);
    const license = await _license.default.create(req.body);
    req.customer.license = license._id;
    await req.customer.save();
    return res.status(_httpStatus.default.CREATED).json(license);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addLicense = addLicense;

const deleteLicense = async (req, res) => {
  try {
    const license = await _license.default.findOne({
      _id: req.params.id
    });
    license.isActive = false;
    await license.save();
    return res.status(_httpStatus.default.OK).json(license);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.deleteLicense = deleteLicense;

const updateLicense = async (req, res) => {
  try {
    const license = await _license.default.findByIdAndUpdate({
      _id: req.params.id
    }, req.body);
    return res.status(_httpStatus.default.OK).json(license);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateLicense = updateLicense;