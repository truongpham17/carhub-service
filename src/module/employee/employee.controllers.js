import HTTPStatus from 'http-status';
import Employee from './employee.model';
import { authAdminOrUser } from '../../utils/auth';

export const getEmployeeList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    if (req.user.role !== 'MANAGER' && req.user.role !== 'EMPLOYEE') {
      throw new Error('Access denied');
    }

    const employees = await Employee.find()
      .populate('hub account')
      .skip(skip)
      .limit(limit);
    const total = await Employee.countDocuments();
    return res.status(HTTPStatus.OK).json({ employees, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      throw new Error('Customer not found');
    }

    authAdminOrUser(req, employee.account);

    return res.status(HTTPStatus.OK).json(employee.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createEmployee = async (req, res) => {
  try {
    if (!authAdminOrUser(req, req.body.account)) {
      throw new Error('Access denied');
    }

    const checkDuplicate = await Employee.findOne({
      account: req.body.account,
    });

    if (checkDuplicate) {
      throw new Error('Duplicate employee');
    }

    // const hub = await Hub  check hub!

    const employee = await Employee.create(req.body);
    return res.status(HTTPStatus.CREATED).json(employee.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      throw new Error('Employee not found!');
    }

    // if (!authAdminOrUser(req, employee.account)) {
    //   throw new Error('Access denied');
    // }

    Object.keys(req.body).forEach(key => {
      employee[key] = req.body[key];
    });

    await employee.save();

    return res.status(HTTPStatus.OK).json(employee.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
