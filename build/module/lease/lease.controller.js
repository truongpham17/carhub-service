"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLease = exports.addLease = exports.getLease = exports.getLeaseList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _lease = _interopRequireDefault(require("./lease.model"));

var _constants = _interopRequireDefault(require("../../config/constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLeaseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const list = await _lease.default.find().skip(skip).limit(limit);
    const total = await _lease.default.count();
    return res.status(_httpStatus.default.OK).json({
      list,
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
    const lease = await _lease.default.findById(id);

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
    return res.status(_httpStatus.default.CREATED).json(lease);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addLease = addLease;

const updateLease = async (req, res) => {
  try {
    const lease = await _lease.default.findByIdAndUpdate({
      _id: req.params.id
    }, req.body);
    return res.status(_httpStatus.default.OK).json(lease);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateLease = updateLease;