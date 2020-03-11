"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCard = exports.deleteCard = exports.addCard = exports.getCard = exports.getCardList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _card = _interopRequireDefault(require("./card.model"));

var _constants = _interopRequireDefault(require("../../config/constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCardList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const list = await _card.default.find().skip(skip).limit(limit);
    const total = await _card.default.count();
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCardList = getCardList;

const getCard = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const card = await _card.default.findById(id);

    if (!card) {
      throw new Error('License Not found');
    }

    return res.status(_httpStatus.default.OK).json(card.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCard = getCard;

const addCard = async (req, res) => {
  try {
    const card = await _card.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(card);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.addCard = addCard;

const deleteCard = async (req, res) => {
  try {
    const card = await _card.default.findOne({
      _id: req.params.id
    });
    card.isActive = false;
    await card.save();
    return res.status(_httpStatus.default.OK).json(card);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.deleteCard = deleteCard;

const updateCard = async (req, res) => {
  try {
    const card = await _card.default.findByIdAndUpdate({
      _id: req.params.id
    }, req.body);
    return res.status(_httpStatus.default.OK).json(card);
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateCard = updateCard;