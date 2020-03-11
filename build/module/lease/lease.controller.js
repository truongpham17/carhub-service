"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLease = exports.addLease = exports.getLease = exports.getLeaseList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _lease = _interopRequireDefault(require("./lease.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLeaseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    let leases;
    let total;

    switch (req.user.role) {
      case 'CUSTOMER':
        leases = await _lease.default.find({
          customer: req.customer._id
        }).skip(skip).limit(limit).populate('customer car hub').populate({
          path: 'car',
          populate: {
            path: 'carModel'
          }
        });
        total = await _lease.default.count({
          customer: req.customer._id
        });
        break;

      case 'EMPLOYEE':
      case 'MANAGER':
        leases = await _lease.default.find().skip(skip).limit(limit).populate('customer car hub').populate({
          path: 'car',
          populate: {
            path: 'carModel'
          }
        });
        total = await _lease.default.count();
        break;

      default:
        throw new Error('Role is not existed!');
    }

    return res.status(_httpStatus.default.OK).json({
      leases,
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
    const lease = await _lease.default.findById(id).populate('customer car hub').populate({
      path: 'car',
      populate: {
        path: 'carModel'
      }
    });

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