"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeExtra = exports.updateExtra = exports.createExtra = exports.getExtraById = exports.getExtra = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _extra = _interopRequireDefault(require("./extra.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getExtra = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const extras = await _extra.default.find({
      isActive: true
    }).skip(skip).limit(limit);
    const total = await _extra.default.countDocuments({
      isActive: true
    });
    return res.status(_httpStatus.default.OK).json({
      extras,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getExtra = getExtra;

const getExtraById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const extra = await _extra.default.findById(id);

    if (!extra) {
      throw new Error('Extra is not found!');
    }

    return res.status(_httpStatus.default.OK).json(extra);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getExtraById = getExtraById;

const createExtra = async (req, res) => {
  try {
    const {
      content,
      price
    } = req.body;
    const extra = await _extra.default.create({
      content,
      price
    });
    return res.status(_httpStatus.default.CREATED).json({
      msg: 'Created!',
      extra
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.createExtra = createExtra;

const updateExtra = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const extra = await _extra.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Updated!',
      extra
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.updateExtra = updateExtra;

const removeExtra = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _extra.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Deleted!'
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.removeExtra = removeExtra;