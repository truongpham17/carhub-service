import HTTPStatus from 'http-status';
import Rental from './rental.model';
import Customer from '../customer/customer.model';

export const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    let rentals;
    let total;
    switch (req.user.role) {
      case 'CUSTOMER':
        // eslint-disable-next-line no-case-declarations
        const customer = await Customer.findOne({ account: req.user._id });
        // console.log(req.user._id);
        // console.log(cus);
        rentals = await Rental.find({ customer: customer._id })
          .skip(skip)
          .limit(limit)
          .populate('car customer leaser pickupHub pickoffHub payment');
        total = await Rental.countDocuments({ customer: customer._id });
        break;
      default:
        rentals = await Rental.find()
          .skip(skip)
          .limit(limit)
          .populate('car customer leaser pickupHub pickoffHub payment');
        total = await Rental.countDocuments();
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
      'car customer leaser pickupHub pickoffHub payment'
    );
    return res.status(HTTPStatus.OK).json(rental);
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
