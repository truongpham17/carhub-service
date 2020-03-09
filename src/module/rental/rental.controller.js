import HTTPStatus from 'http-status';
import Rental from './rental.model';

export const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const rentals = await Rental.find()
      .skip(skip)
      .limit(limit)
      .populate('car customer leaser pickupHub pickoffHub payment');
    const total = await Rental.countDocuments();
    return res.status(HTTPStatus.OK).json({ rentals, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    let rentals;
    switch (req.user.role) {
      case 'CUSTOMER':
        rentals = await Rental.find({ customer: id }).populate(
          'car customer leaser pickupHub pickoffHub payment'
        );
        break;
      default:
        rentals = await Rental.findById(id).populate(
          'car customer leaser pickupHub pickoffHub payment'
        );
    }
    return res.status(HTTPStatus.OK).json(rentals);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addRental = async (req, res) => {
  try {
    const rental = await Rental.create(req.body);
    res.status(HTTPStatus.CREATED).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndUpdate({ _id: id }, req.body);
    return res.status(HTTPStatus.OK).json({ msg: 'Updated!', rental });
  } catch (error) {
    res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const removeRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndUpdate(
      { _id: id },
      { isActive: false }
    );
    return res.status(HTTPStatus.OK).json({ msg: 'Deleted!!', rental });
  } catch (err) {
    res.status(HTTPStatus.BAD_REQUEST).json(err);
  }
};
