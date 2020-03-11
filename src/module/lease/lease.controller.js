import HTTPStatus from 'http-status';
import Lease from './lease.model';

export const getLeaseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    let leases;
    let total;
    switch (req.user.role) {
      case 'CUSTOMER':
        leases = await Lease.find({ customer: req.customer._id })
          .skip(skip)
          .limit(limit)
          .populate('customer car hub')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Lease.count({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
      case 'MANAGER':
        leases = await Lease.find()
          .skip(skip)
          .limit(limit)
          .populate('customer car hub')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Lease.count();
        break;
      default:
        throw new Error('Role is not existed!');
    }
    return res.status(HTTPStatus.OK).json({ leases, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getLease = async (req, res) => {
  try {
    const { id } = req.params;
    const lease = await Lease.findById(id)
      .populate('customer car hub')
      .populate({ path: 'car', populate: { path: 'carModel' } });
    if (!lease) {
      throw new Error('Lease Not found');
    }
    return res.status(HTTPStatus.OK).json(lease.toJSON());
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
    const lease = await Lease.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    return res.status(HTTPStatus.OK).json(lease);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
