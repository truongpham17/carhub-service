import HTTPStatus from 'http-status';
import Account from './account.model';
import Customer from '../customer/customer.model';
import Employee from '../employee/employee.model';
import Manager from '../manager/manager.model';
import License from '../license/license.model';

export const getAccountList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const { search } = req.query;
  try {
    if (req.user.role !== 'MANAGER') {
      throw new Error('Not manager');
    }

    let list;
    const queries = !search ? {} : { $text: { $search: search } };
    if (search) {
      list = await Account.find(queries, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit);
    } else {
      list = await Account.find(queries)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    }
    const total = await Account.count(queries);
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const account = await Account.findOne({ username });
    console.log(account);
    if (!account || !account.validatePassword(password)) {
      throw new Error('Wrong username or password');
    }
    let accountDetail = null;
    switch (account.role) {
      case 'CUSTOMER': {
        accountDetail = await Customer.findOne({
          account: account._id,
        }).populate({ path: 'license', model: License });
        return res
          .status(HTTPStatus.OK)
          .json({ ...account.toAuthJSON(), ...accountDetail.toJSON() });
      }
      case 'EMPLOYEE': {
        accountDetail = await Employee.findOne({ account: account._id });
        return res
          .status(HTTPStatus.OK)
          .json({ ...account.toAuthJSON(), ...accountDetail.toJSON() });
      }
      case 'MANAGER': {
        accountDetail = await Manager.findOne({ account: account._id });
        return res
          .status(HTTPStatus.OK)
          .json({ ...accountDetail.toJSON(), ...account.toAuthJSON() });
      }
      default: {
        throw new Error('Account not found!');
      }
    }
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    // only admin can get all account
    // one account can get their info only
    if (req.user.role !== 'MANAGER' && req.user._id.toString() !== id) {
      throw new Error('Access denied');
    }

    const account = await Account.findOne({ _id: id });

    if (account) {
      return res.status(HTTPStatus.OK).json(account.toJSON());
    }
    throw new Error('Account not found!');
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createAccount = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username.length <= 5) {
      throw new Error('Min length is 6');
    }
    const checkDuplicate = await Account.findOne({
      username: req.body.username,
    });
    if (checkDuplicate) {
      throw new Error('Duplicate user!');
    }
    const user = await Account.create({
      ...req.body,
      // password: Account.hashPassword(req.password),
    });

    user.password = user.hashPassword(req.password);
    await user.save();

    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'MANAGER' && req.user._id.toString() !== id) {
      throw new Error('Access denied!');
    }

    const account = await Account.findOne({ _id: id });
    if (!account) {
      throw new Error('Account not found!');
    }

    Object.keys(req.body).forEach(key => {
      account[key] = req.body[key];
    });
    await account.save();

    return res.status(HTTPStatus.OK).json(account.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    if (req.user.role !== 'MANAGER') {
      throw new Error('Access denied');
    }

    const user = await Account.findById(req.params.id);

    if (user) {
      user.isActive = false;
      await user.save();
    } else {
      throw new Error('User not found');
    }
    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
