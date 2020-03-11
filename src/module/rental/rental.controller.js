import HTTPStatus from 'http-status';
import Rental from './rental.model';

export const getRental = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const rentals = await Rental.find({ isActive: true })
      .skip(skip)
      .limit(limit);
    const total = await Rental.countDocuments({ isActive: true });
    return res.status(HTTPStatus.OK).json({ rentals, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);
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
    const rental = await Rental.findByIdAndUpdate({ _id: id }, req.body);
    return res.json({ msg: 'Updated!', rental });
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
    return res.json({ msg: 'Deleted!!', rental });
  } catch (err) {
    res.status(HTTPStatus.BAD_REQUEST).json(err);
  }
};
