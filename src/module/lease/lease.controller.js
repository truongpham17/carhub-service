import HTTPStatus from 'http-status';
import Lease from './lease.model';
import constants from '../../config/constants';

export const getLeaseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const list = await Lease.find()
      .skip(skip)
      .limit(limit);
    const total = await Lease.count();
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addLease = async (req, res) => {
  try {
    const lease = await Lease.create(req.body);
    return res.status(HTTPStatus.CREATED).json(lease);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateLease = async (req, res) => {
  try {
    const lease = await Lease.findOne({ _id: req.params.id });
    if (!lease) {
      throw new Error('Not found');
    }
    Object.keys(req.body).forEach(key => {
      lease[key] = req.body[key];
    });
    await lease.save();
    return res.status(HTTPStatus.OK).json(lease);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
