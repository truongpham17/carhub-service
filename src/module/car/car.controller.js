import HTTPStatus from 'http-status';
import Car from './car.model';

export const getCarList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    let cars;
    let total;
    switch (req.user.role) {
      case 'CUSTOMER':
        cars = await Car.find({ customer: req.customer._id })
          .skip(skip)
          .limit(limit)
          .populate('carModel hub currentHub');
        total = await Car.count({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
      case 'MANAGER':
        cars = await Car.find()
          .skip(skip)
          .limit(limit)
          .populate('carModel hub currentHub');
        total = await Car.count();
        break;
      default:
        throw new Error('Role is not existed!');
    }
    return res.status(HTTPStatus.OK).json({ cars, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById({ _id: id }).populate(
      'carModel hub currentHub'
    );
    if (!car) {
      throw new Error('Car not found!');
    }
    return res.status(HTTPStatus.OK).json({ car });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCarsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const car = await Car.findOne({
      customer: customerId,
      isActive: true,
    });
    if (!car) {
      throw new Error('Car is not found!');
    }
    return res.status(HTTPStatus.OK).json({ car });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCarsByHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const cars = await Car.find({ hub: hubId });
    if (!cars) {
      throw new Error('Car is not found');
    }
    const total = await Car.count({ hub: hubId });
    return res.status(HTTPStatus.OK).json({ cars, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    return res
      .status(HTTPStatus.CREATED)
      .json({ msg: 'Created successfully!', car });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate({ _id: id }, req.body);
    return res
      .status(HTTPStatus.OK)
      .json({ msg: 'Updated successfully!', car });
  } catch (error) {
    res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const removeCar = async (req, res) => {
  try {
    const { id } = req.params;
    await Car.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.status(HTTPStatus.OK).json({ msg: 'Deleted successfully!s' });
  } catch (error) {
    res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const checkCarByVin = async (req, res) => {
  try {
    const { vin } = req.params;
    const car = await Car.find({ VIN: vin });
    return res.status(HTTPStatus.OK).json({ car });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.messages);
  }
};
