import HTTPStatus from 'http-status';
import Account from './account.model';

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
  const { username, password } = req.body;
  const account = await Account.findOne({ username, password });
  if (!account) {
    throw new Error('Wrong username or password');
  }
  return res.status(HTTPStatus.OK).json(account.toAuthJSON());
};

export const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('user id is: ', id);
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
    const user = await Account.create(req.body);

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
