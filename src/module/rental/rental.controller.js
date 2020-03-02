import Rental from './rental.model';

export const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const rentals = await Rental.find({ isActive: true })
    .skip(skip)
    .limit(limit);
  const total = await Rental.count({ isActive: true });
  return res.json({ rentals, total });
};

export const getRentalById = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  return res.json(rental);
};

export const addRental = async (req, res) => {
  const rental = await Rental.create(req.body);
  res.json(rental);
};

export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndUpdate({ _id: id }, req.body);
    return res.json({ msg: 'Updated!', rental });
  } catch (error) {
    res.status(404).json(error);
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
    res.status(404).json(err);
  }
};
