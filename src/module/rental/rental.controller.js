import HTTPStatus from 'http-status';
import Rental from './rental.model';

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
          .populate('car customer leaser pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
      case 'MANAGER':
        rentals = await Rental.find()
          .skip(skip)
          .limit(limit)
          .populate('car customer leaser pickupHub pickoffHub payment carModel')
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
    return res.status(HTTPStatus.CREATED).json(rental.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    Object.keys(req.body).forEach(key => {
      rental[key] = req.body[key];
    });
    await rental.save();
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
    const rental = await Rental.findById(id);

    if (!rental) {
      throw new Error('Rental not found');
    }

    // 'UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'
    const { status } = rental;
    switch (status) {
      case 'UPCOMING':
        rental.status = 'CURRENT';
        break;
      case 'CURRENT':
      case 'OVERDUE':
        rental.status = 'PAST';
        break;
      case 'SHARING':
        rental.status = 'SHARED';
        break;
      default:
        break;
    }
    await rental.save();

    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json();
  }
};
