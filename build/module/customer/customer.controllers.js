"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCustomer = exports.createCustomer = exports.getCustomer = exports.getCustomerList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _customer = _interopRequireDefault(require("./customer.model"));

var _auth = require("../../utils/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCustomerList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    if (req.user.role !== 'MANAGER' && req.user.role !== 'EMPLOYEE') {
      console.log(req.user.role);
      throw new Error('Access denied');
    }

    const list = await _customer.default.find().skip(skip).limit(limit);
    const total = await _customer.default.countDocuments();
    return res.status(_httpStatus.default.OK).json({
      list,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCustomerList = getCustomerList;

const getCustomer = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const customer = await _customer.default.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    (0, _auth.authAdminOrUser)(req, customer.account);
    return res.status(_httpStatus.default.OK).json(customer.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCustomer = getCustomer;

const createCustomer = async (req, res) => {
  try {
    if (!(0, _auth.authAdminOrUser)(req, req.body.account)) {
      throw new Error('Access denied');
    }

    const checkDuplicate = await _customer.default.findOne({
      account: req.body.account
    });

    if (checkDuplicate) {
      throw new Error('Duplicate customer');
    }

    const customer = await _customer.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(customer.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createCustomer = createCustomer;

const updateCustomer = async (req, res) => {
  try {
    // id phai la id cua customer
    const {
      id
    } = req.params;
    const customer = await _customer.default.findById(id);

    if (!customer) {
      throw new Error('Customer not found!');
    }

    if (!(0, _auth.authAdminOrUser)(req, customer.account)) {
      throw new Error('Access denied');
    }

    Object.keys(req.body).forEach(key => {
      customer[key] = req.body[key];
    });
    await customer.save();
    return res.status(_httpStatus.default.OK).json(customer.toJSON());
  } catch (e) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
}; // export const deleteCustomer = async (req, res) => {
//   try {
//     const user = await Customer.findOneAndRemove({ _id: req.params.id });
//     if (!user) {
//       throw new Error('Not found');
//     }
//     return res.status(HTTPStatus.OK).json(user.toJSON());
//   } catch (e) {
//     return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
//   }
// };


exports.updateCustomer = updateCustomer;