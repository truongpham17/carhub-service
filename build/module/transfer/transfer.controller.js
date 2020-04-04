"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeTransfer = exports.updateTransfer = exports.createTransfer = exports.getTransfer = exports.getTransferList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _transfer = _interopRequireDefault(require("./transfer.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTransferList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const transfers = await _transfer.default.find().limit(limit).skip(skip);
    const total = await _transfer.default.count();
    return res.status(_httpStatus.default.OK).json({
      transfers,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getTransferList = getTransferList;

const getTransfer = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const transfer = await _transfer.default.findById({
      _id: id
    });

    if (!transfer) {
      throw new Error('Transfer not found!');
    }

    return res.status(_httpStatus.default.OK).json(transfer);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getTransfer = getTransfer;

const createTransfer = async (req, res) => {
  try {
    const transfer = await _transfer.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(transfer);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createTransfer = createTransfer;

const updateTransfer = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const transfer = await _transfer.default.findById(id);
    Object.keys(req.body).forEach(key => {
      transfer[key] = req.body[key];
    });
    await transfer.save();
    return res.status(_httpStatus.default.OK).json(transfer);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.updateTransfer = updateTransfer;

const removeTransfer = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _transfer.default.findByIdAndUpdate({
      _id: id
    });
    return res.json(_httpStatus.default.OK).json({
      msg: 'Deteled successfully!'
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.removeTransfer = removeTransfer;