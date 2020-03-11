"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAccount = exports.updateAccount = exports.createAccount = exports.getAccount = exports.login = exports.getAccountList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _account = _interopRequireDefault(require("./account.model"));

var _customer = _interopRequireDefault(require("../customer/customer.model"));

var _employee = _interopRequireDefault(require("../employee/employee.model"));

var _manager = _interopRequireDefault(require("../manager/manager.model"));

var _license = _interopRequireDefault(require("../license/license.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAccountList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const {
    search
  } = req.query;

  try {
    if (req.user.role !== 'MANAGER') {
      throw new Error('Not manager');
    }

    let list;
    const queries = !search ? {} : {
      $text: {
        $search: search
      }
    };

    if (search) {
      list = await _account.default.find(queries, {
        score: {
          $meta: 'textScore'
        }
      }).sort({
        score: {
          $meta: 'textScore'
        }
      }).skip(skip).limit(limit);
    } else {
      list = await _account.default.find(queries).sort({
        name: 1
      }).skip(skip).limit(limit);
    }

    const total = await _account.default.count(queries);
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getAccountList = getAccountList;

const login = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;
    const account = await _account.default.findOne({
      username
    });

    if (!account || !account.validatePassword(password)) {
      throw new Error('Wrong username or password');
    }

    let accountDetail = null;

    switch (account.role) {
      case 'CUSTOMER':
        {
          accountDetail = await _customer.default.findOne({
            account: account._id
          }).populate({
            path: 'license',
            model: _license.default
          });
          break;
        }

      case 'EMPLOYEE':
        {
          accountDetail = await _employee.default.findOne({
            account: account._id
          });
          break;
        }

      case 'MANAGER':
        {
          accountDetail = await _manager.default.findOne({
            account: account._id
          });
          break;
        }

      default:
        {}
    }

    if (!accountDetail) {
      throw new Error('Account not found!');
    }

    return res.status(_httpStatus.default.OK).json({ ...account.toAuthJSON(),
      ...accountDetail.toJSON()
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.login = login;

const getAccount = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    console.log('user id is: ', id); // only admin can get all account
    // one account can get their info only

    if (req.user.role !== 'MANAGER' && req.user._id.toString() !== id) {
      throw new Error('Access denied');
    }

    const account = await _account.default.findOne({
      _id: id
    });

    if (account) {
      return res.status(_httpStatus.default.OK).json(account.toJSON());
    }

    throw new Error('Account not found!');
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getAccount = getAccount;

const createAccount = async (req, res) => {
  try {
    const {
      username
    } = req.body;

    if (!username || username.length <= 5) {
      throw new Error('Min length is 6');
    }

    const checkDuplicate = await _account.default.findOne({
      username: req.body.username
    });

    if (checkDuplicate) {
      throw new Error('Duplicate user!');
    }

    const user = await _account.default.create({ ...req.body // password: Account.hashPassword(req.password),

    });
    user.password = user.hashPassword(req.password);
    await user.save();
    return res.status(_httpStatus.default.CREATED).json(user.toAuthJSON());
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createAccount = createAccount;

const updateAccount = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    if (req.user.role !== 'MANAGER' && req.user._id.toString() !== id) {
      throw new Error('Access denied!');
    }

    const account = await _account.default.findOne({
      _id: id
    });

    if (!account) {
      throw new Error('Account not found!');
    }

    Object.keys(req.body).forEach(key => {
      account[key] = req.body[key];
    });
    await account.save();
    return res.status(_httpStatus.default.OK).json(account.toJSON());
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateAccount = updateAccount;

const deleteAccount = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      throw new Error('Access denied');
    }

    const user = await _account.default.findById(req.params.id);

    if (user) {
      user.isActive = false;
      await user.save();
    } else {
      throw new Error('User not found');
    }

    return res.status(_httpStatus.default.OK).json(user.toJSON());
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.deleteAccount = deleteAccount;