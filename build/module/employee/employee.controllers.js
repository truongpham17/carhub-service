"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEmployee = exports.createEmployee = exports.getEmployee = exports.getEmployeeList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _employee = _interopRequireDefault(require("./employee.model"));

var _auth = require("../../utils/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getEmployeeList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    if (req.user.role !== 'MANAGER' && req.user.role !== 'EMPLOYEE') {
      throw new Error('Access denied');
    }

    const employees = await _employee.default.find().populate('hub account').skip(skip).limit(limit);
    const total = await _employee.default.countDocuments();
    return res.status(_httpStatus.default.OK).json({
      employees,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getEmployeeList = getEmployeeList;

const getEmployee = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const employee = await _employee.default.findById(id);

    if (!employee) {
      throw new Error('Customer not found');
    }

    (0, _auth.authAdminOrUser)(req, employee.account);
    return res.status(_httpStatus.default.OK).json(employee.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getEmployee = getEmployee;

const createEmployee = async (req, res) => {
  try {
    if (!(0, _auth.authAdminOrUser)(req, req.body.account)) {
      throw new Error('Access denied');
    }

    const checkDuplicate = await _employee.default.findOne({
      account: req.body.account
    });

    if (checkDuplicate) {
      throw new Error('Duplicate employee');
    } // const hub = await Hub  check hub!


    const employee = await _employee.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(employee.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createEmployee = createEmployee;

const updateEmployee = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const employee = await _employee.default.findById(id);

    if (!employee) {
      throw new Error('Employee not found!');
    } // if (!authAdminOrUser(req, employee.account)) {
    //   throw new Error('Access denied');
    // }


    Object.keys(req.body).forEach(key => {
      employee[key] = req.body[key];
    });
    await employee.save();
    return res.status(_httpStatus.default.OK).json(employee.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(_httpStatus.default.BAD_REQUEST).json(e.message || e);
  }
};

exports.updateEmployee = updateEmployee;