"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeExtra = exports.updateExtra = exports.createExtra = exports.getExtraById = exports.getExtra = void 0;

var _extra = _interopRequireDefault(require("./extra.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getExtra = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const extras = await _extra.default.find({
    isActive: true
  }).skip(skip).limit(limit);
  const total = await _extra.default.countDocuments({
    isActive: true
  });
  return res.json({
    extras,
    total
  });
};

exports.getExtra = getExtra;

const getExtraById = async (req, res) => {
  const {
    id
  } = req.params;
  const extra = await _extra.default.findById(id);
  return res.json(extra);
};

exports.getExtraById = getExtraById;

const createExtra = async (req, res) => {
  const {
    content,
    price
  } = req.body;
  const extra = await _extra.default.create({
    content,
    price
  });
  return res.json({
    msg: 'Created!',
    extra
  });
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
    return res.json({
      msg: 'Updated!',
      extra
    });
  } catch (error) {
    res.status(404).json(error);
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
    return res.json({
      msg: 'Deleted!'
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.removeExtra = removeExtra;