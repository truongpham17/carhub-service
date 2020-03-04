import HTTPStatus from 'http-status';
import Customer from './customer.model';
import { authAdminOrUser } from '../../utils/auth';

export const getCustomerList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    if (req.user.role !== 'MANAGER' && req.user.role !== 'EMPLOYEE') {
      console.log(req.user.role);
      throw new Error('Access denied');
    }

    const list = await Customer.find()
      .skip(skip)
      .limit(limit);
    const total = await Customer.countDocuments();
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    authAdminOrUser(req, customer.account);

    return res.status(HTTPStatus.OK).json(customer.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createCustomer = async (req, res) => {
  try {
    if (!authAdminOrUser(req, req.body.account)) {
      throw new Error('Access denied');
    }

    const checkDuplicate = await Customer.findOne({
      account: req.body.account,
    });

    if (checkDuplicate) {
      throw new Error('Duplicate customer');
    }

    const customer = await Customer.create(req.body);
    return res.status(HTTPStatus.CREATED).json(customer.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    // id phai la id cua customer

    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      throw new Error('Customer not found!');
    }

    if (!authAdminOrUser(req, customer.account)) {
      throw new Error('Access denied');
    }

    Object.keys(req.body).forEach(key => {
      customer[key] = req.body[key];
    });

    await customer.save();

    return res.status(HTTPStatus.OK).json(customer.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

// export const deleteCustomer = async (req, res) => {
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
