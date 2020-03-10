"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateManager = exports.createManager = exports.getManager = exports.getManagerList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _manager = _interopRequireDefault(require("./manager.model"));

var _auth = require("../../utils/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getManagerList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    if (req.user.role !== 'MANAGER') {
      throw new Error('Access denied');
    }

    const list = await _manager.default.find().skip(skip).limit(limit);
    const total = await _manager.default.countDocuments();
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getManagerList = getManagerList;

const getManager = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const manager = await _manager.default.findById(id);

    if (!manager) {
      throw new Error('Customer not found');
    }

    (0, _auth.authAdminOrUser)(req, manager.account);
    return res.status(_httpStatus.default.OK).json(manager.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getManager = getManager;

const createManager = async (req, res) => {
  try {
    if (!(0, _auth.authAdminOrUser)(req, req.body.account)) {
      throw new Error('Access denied');
    }

    const checkDuplicate = await _manager.default.findOne({
      account: req.body.account
    });

    if (checkDuplicate) {
      throw new Error('Duplicate manager');
    }

    const manager = await _manager.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(manager.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createManager = createManager;

const updateManager = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const manager = await _manager.default.findById(id);

    if (!manager) {
      throw new Error('Manager not found!');
    }

    if (req.user.role !== 'MANAGER') {
      throw new Error('Access denied');
    }

    Object.keys(req.body).forEach(key => {
      manager[key] = req.body[key];
    });
    await manager.save();
    return res.status(_httpStatus.default.OK).json(manager.toJSON());
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
}; // export const deleteManager = async (req, res) => {
//   try {
//     const user = await Manager.findOneAndRemove({ _id: req.params.id });
//     if (!user) {
//       throw new Error('Not found');
//     }
//     return res.status(HTTPStatus.OK).json(user.toJSON());
//   } catch (e) {
//     return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
//   }
// };


exports.updateManager = updateManager;