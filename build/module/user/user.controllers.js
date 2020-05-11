"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getTestRecord = exports.getUserList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _user = _interopRequireDefault(require("./user.model"));

var _constants = _interopRequireDefault(require("../../config/constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getUserList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const {
    search
  } = req.query;

  try {
    let list;
    const queries = !search ? {} : {
      $text: {
        $search: search
      }
    };

    if (search) {
      list = await _user.default.find(queries, {
        score: {
          $meta: 'textScore'
        }
      }).sort({
        score: {
          $meta: 'textScore'
        }
      }).skip(skip).limit(limit);
    } else {
      list = await _user.default.find(queries).sort({
        name: 1
      }).skip(skip).limit(limit);
    }

    const total = await _user.default.count(queries);
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getUserList = getUserList;

const getTestRecord = async (req, res) => res.status(_httpStatus.default.OK).json({
  success: true
});

exports.getTestRecord = getTestRecord;

const getUser = async (req, res) => {
  try {
    const user = await _user.default.findOne({
      _id: req.params.id
    });
    return res.status(_httpStatus.default.OK).json(user.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getUser = getUser;

const createUser = async (req, res) => {
  try {
    const {
      username
    } = req.body;

    if (!username || username.length <= 5) {
      throw new Error('Min length is 6');
    }

    const checkDuplicate = await _user.default.findOne({
      username: req.body.username
    });

    if (checkDuplicate) {
      throw new Error('Duplicate user!');
    }

    const user = await _user.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(user.toJSON());
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createUser = createUser;

const updateUser = async (req, res) => {
  try {
    const user = await _user.default.findOne({
      _id: req.params.id
    });

    if (!user) {
      throw new Error('Not found');
    }

    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });
    await user.save();
    return res.status(_httpStatus.default.OK).json(user.toJSON());
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateUser = updateUser;

const deleteUser = async (req, res) => {
  try {
    const user = await _user.default.findOneAndRemove({
      _id: req.params.id
    });

    if (!user) {
      throw new Error('Not found');
    }

    return res.status(_httpStatus.default.OK).json(user.toJSON());
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.deleteUser = deleteUser;