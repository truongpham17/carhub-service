import Car from './car.model';

export const getCar = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const cars = await Car.find()
    .skip(skip)
    .limit(limit);
  const total = await Car.count();
  return res.json({ cars, total });
};

export const getCarById = async (req, res) => {
  const { id } = req.params;
  const car = await Car.findById({ _id: id });
  return res.json({ car });
};

export const createCar = async (req, res) => {
  const car = await Car.create(req.body);
  return res.json({ msg: 'Created successfully!', car });
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate({ _id: id }, req.body);
    return res.json({ msg: 'Updated successfully!', car });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const removeCar = async (req, res) => {
  try {
    const { id } = req.params;
    await Car.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.json({ msg: 'Deleted successfully!' });
  } catch (error) {
    res.status(404).json(error);
  }
};
