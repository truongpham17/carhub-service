import HTTPStatus from 'http-status';
import Lease from './lease.model';
import Transaction from '../transaction/transaction.model';
import Log from '../log/log.model';

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
          .populate('car hub')
          .populate({ path: 'car', populate: { path: 'carModel customer' } });
        total = await Lease.countDocuments({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
        leases = await Lease.find({ hub: req.employee.hub })
          .skip(skip)
          .limit(limit)
          .populate('car hub')
          .populate({ path: 'car', populate: { path: 'carModel customer' } });
        total = await Lease.count({ hub: req.employee.hub });
        break;
      case 'MANAGER':
        leases = await Lease.find()
          .skip(skip)
          .limit(limit)
          .populate('car hub')
          .populate({ path: 'car', populate: { path: 'carModel customer' } });
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
      .populate('car hub')
      .populate({ path: 'car', populate: { path: 'carModel customer' } });
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

    await Log.create({
      type: 'CREATE',
      title: 'Create lease request',
      detail: lease._id,
    });

    return res.status(HTTPStatus.CREATED).json(lease);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateLease = async (req, res) => {
  try {
    const { data, log } = req.body;
    const lease = await Lease.findById(req.params.id);
    Object.keys(data).forEach(key => {
      lease[key] = data[key];
    });
    await lease.save();

    await Log.create({ detail: lease._id, ...log });

    return res.status(HTTPStatus.OK).json(lease);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

/*

    'PENDING',
        'UPCOMING',
        'DECLINE',
        'AVAILABLE',
        'HIRING',
        'WAIT_TO_RETURN',
        'PAST', */

export const submitTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeID } = req.body;
    console.log(id);
    const lease = await Lease.findById(id);

    if (!lease || !lease.isActive) {
      throw new Error('lease not found');
    }

    // 'PENDING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'
    const { status } = lease;
    let transactionValue = '';
    switch (status) {
      case 'AVAILABLE':
      case 'WAIT_TO_RETURN':
        lease.status = 'PAST';
        transactionValue = 'GET_CAR';
        break;
      case 'ACCEPTED':
        lease.status = 'AVAILABLE';
        transactionValue = 'RETURN_CAR';
        break;
      default:
        break;
    }
    await lease.save();
    if (transactionValue) {
      await Transaction.create({
        // employee: req.employee._id,
        transactionType: 'LEASE',
        value: transactionValue,
        lease: id,
        employee: employeeID,
      });
    }

    return res.status(HTTPStatus.OK).json(lease);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};
