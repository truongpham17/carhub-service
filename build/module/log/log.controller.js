"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeLog = exports.updateLog = exports.createLog = exports.getLog = exports.getGroupingLog = exports.getLogList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _log = _interopRequireDefault(require("./log.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLogList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const logs = await _log.default.find().limit(limit).skip(skip);
    const total = await _log.default.count();
    return res.status(_httpStatus.default.OK).json({
      logs,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getLogList = getLogList;

const getGroupingLog = async (req, res) => {
  const {
    id
  } = req.params;

  try {
    const logs = await _log.default.find({
      detail: id
    });
    return res.status(_httpStatus.default.OK).json(logs);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getGroupingLog = getGroupingLog;

const getLog = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const log = await _log.default.findById({
      _id: id
    });

    if (!log) {
      throw new Error('Log not found!');
    }

    return res.status(_httpStatus.default.OK).json(log);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.getLog = getLog;

const createLog = async (req, res) => {
  try {
    const log = await _log.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(log);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createLog = createLog;

const updateLog = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const log = await _log.default.findById(id);
    Object.keys(req.body).forEach(key => {
      log[key] = req.body[key];
    });
    await log.save();
    return res.status(_httpStatus.default.OK).json(log);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.updateLog = updateLog;

const removeLog = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _log.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.json(_httpStatus.default.OK).json({
      msg: 'Deteled successfully!'
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.removeLog = removeLog;