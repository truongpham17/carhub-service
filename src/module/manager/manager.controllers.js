import HTTPStatus from 'http-status';
import Manager from './manager.model';
import { authAdminOrUser } from '../../utils/auth';

export const getManagerList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    if (req.user.role !== 'MANAGER') {
      throw new Error('Access denied');
    }

    const list = await Manager.find()
      .skip(skip)
      .limit(limit);
    const total = await Manager.countDocuments();
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getManager = async (req, res) => {
  try {
    const { id } = req.params;

    const manager = await Manager.findById(id);

    if (!manager) {
      throw new Error('Customer not found');
    }

    authAdminOrUser(req, manager.account);

    return res.status(HTTPStatus.OK).json(manager.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createManager = async (req, res) => {
  try {
    if (!authAdminOrUser(req, req.body.account)) {
      throw new Error('Access denied');
    }

    const checkDuplicate = await Manager.findOne({
      account: req.body.account,
    });

    if (checkDuplicate) {
      throw new Error('Duplicate manager');
    }

    const manager = await Manager.create(req.body);
    return res.status(HTTPStatus.CREATED).json(manager.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateManager = async (req, res) => {
  try {
    const { id } = req.params;

    const manager = await Manager.findById(id);

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

    return res.status(HTTPStatus.OK).json(manager.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

// export const deleteManager = async (req, res) => {
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
