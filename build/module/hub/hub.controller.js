"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeHub = exports.updateHub = exports.createHub = exports.getHubById = exports.getHubList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _hub = _interopRequireDefault(require("./hub.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getHubList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const hubs = await _hub.default.find().limit(limit).skip(skip);
    const total = await _hub.default.count();
    return res.status(_httpStatus.default.OK).json({
      hubs,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getHubList = getHubList;

const getHubById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const hub = await _hub.default.findById({
      _id: id
    });

    if (!hub) {
      throw new Error('Hub not found!');
    }

    return res.status(_httpStatus.default.OK).json({
      hub
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getHubById = getHubById;

const createHub = async (req, res) => {
  try {
    const hub = await _hub.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json({
      msg: 'Created successfully!',
      hub
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createHub = createHub;

const updateHub = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const hub = await _hub.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Update successfully!',
      hub
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.updateHub = updateHub;

const removeHub = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _hub.default.findByIdAndUpdate({
      _id: id
    });
    return res.json(_httpStatus.default.OK).json({
      msg: 'Deteled successfully!'
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.removeHub = removeHub;