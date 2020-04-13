import HTTPStatus from 'http-status';
import Rental from './rental.model';
import Log from '../log/log.model';
import Transaction from '../transaction/transaction.model';

export const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    let rentals;
    let total;
    switch (req.user.role) {
      case 'CUSTOMER':
        rentals = await Rental.find({ customer: req.customer._id })
          .skip(skip)
          .limit(limit)
          .sort({ updatedAt: -1 })
          .populate('car customer pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
        rentals = await Rental.find({
          pickupHub: req.employee.hub,
          status: 'UPCOMING',
        })
          .skip(skip)
          .limit(limit)
          .populate('car customer pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments();
        break;
      case 'MANAGER':
        rentals = await Rental.find()
          .skip(skip)
          .limit(limit)
          .populate('car customer pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments();
        break;
      default:
        throw new Error('Role is not existed!');
    }
    return res.status(HTTPStatus.OK).json({ rentals, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id).populate(
      'car customer leaser pickupHub pickoffHub payment carModel'
    );
    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addRental = async (req, res) => {
  try {
    const rental = await Rental.create(req.body);
    await Log.create({
      type: 'CREATE',
      title: 'Create rental request',
      detail: rental._id,
    });
    return res.status(HTTPStatus.CREATED).json(rental.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, log } = req.body;

    const rental = await Rental.findById(id);
    Object.keys(data).forEach(key => {
      rental[key] = data[key];
    });
    await rental.save();
    await Log.create({ detail: rental._id, ...log });

    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const removeRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete({ _id: id });
    return res.status(HTTPStatus.OK).json({ msg: 'Deleted!!', rental });
  } catch (err) {
    return res.status(HTTPStatus.BAD_REQUEST).json(err);
  }
};

export const submitTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeID } = req.body;
    // if (!req.employee) throw new Error('Permission denied!');

    const rental = await Rental.findById(id);

    if (!rental) {
      throw new Error('Rental not found');
    }

    // 'UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'
    const { status } = rental;
    const { toStatus, car } = req.body;
    let log = {};
    switch (status) {
      case 'UPCOMING':
        rental.status = 'CURRENT';
        log = { type: 'RECEIVE', title: 'Take car at hub' };
        rental.car = car;
        break;
      case 'CURRENT':
        rental.status = toStatus;
        if (toStatus === 'SHARING') {
          log = { type: 'CREATE_SHARING', title: 'Request sharing car' };
        }
        if (toStatus === 'PAST') {
          log = { type: 'RETURN', title: 'Return car' };
        }
        break;
      case 'OVERDUE':
        rental.status = 'PAST';
        log = { type: 'RETURN', title: 'Return car' };
        break;
      case 'SHARING':
        rental.status = 'SHARED';

        if (toStatus === 'SHARED') {
          log = { type: 'CONFIRM_SHARING', title: 'Confirm sharing car' };
        }
        if (toStatus === 'CURRENT') {
          log = { type: 'CANCEL_SHARING', title: 'Cancel sharing car' };
        }
        break;
      default:
        break;
    }
    await rental.save();
    if (log) {
      await Log.create({ detail: rental._id, ...log });
    }

    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};
