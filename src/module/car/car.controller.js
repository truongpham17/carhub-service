import httpStatus from 'http-status';
import Car from './car.model';
import Hub from '../hub/hub.model';
import Rental from '../rental/rental.model';
import Lease from '../lease/lease.model';

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
    return res.status(httpStatus.OK).json({ cars, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
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
    return res.status(httpStatus.OK).json({ car });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
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
    return res.status(httpStatus.OK).json({ car });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCustomerPreviousCarList = async (req, res) => {
  try {
    const cars = await Car.find({
      customer: req.customer._id,
      isActive: true,
    }).populate('carModel');

    if (!cars) {
      throw new Error('Car is not found!');
    }
    return res.status(httpStatus.OK).json(cars);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
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
    return res.status(httpStatus.OK).json({ cars, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    return res
      .status(httpStatus.CREATED)
      .json({ msg: 'Created successfully!', car });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const car = await Car.findById(id);
    Object.keys(req.body).forEach(key => {
      car[key] = req.body[key];
    });
    await car.save();
    return res.status(httpStatus.OK).json(car);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const removeCar = async (req, res) => {
  try {
    const { id } = req.params.id;
    await Car.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.status(httpStatus.OK).json({ msg: 'Deleted successfully!s' });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const checkCarByVin = async (req, res) => {
  try {
    const { vin } = req.params;
    const car = await Car.find({ VIN: vin });
    return res.status(httpStatus.OK).json({ car });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

/*
  body: {
    fromHub
    toHub
    list [{
      _id
    }]
  }
 */
export const transferLeasingCar = async (req, res) => {
  try {
    const { fromHub, toHub, list } = req.body;
    const carList = await Promise.all(
      list.map(async item => {
        const car = await Car.findOne({
          _id: item._id,
          customer: { $ne: null },
          currentHub: fromHub,
        });
        if (car) {
          car.currentHub = toHub;
          await car.save();
          return car;
        }
        console.log(item._id);
        console.log('car is null');
        throw new Error('Car not found');
      })
    );

    return res.status(httpStatus.OK).json(carList);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const createCarAfterCheckingVin = async (req, res) => {
  try {
    const checkCar = await Car.findOne({ VIN: req.body.VIN });
    if (checkCar) {
      const newCar = await Car.findByIdAndUpdate(
        { _id: checkCar._id },
        req.body
      );
      return res.status(httpStatus.CREATED).json(newCar);
    }
    const car = await Car.create(req.body);
    return res.status(httpStatus.CREATED).json(car);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const getHubCarList = async (req, res) => {
  try {
    if (!req.employee) {
      throw new Error('Accept denined!');
    }
    const hub = await Hub.findById(req.employee.hub);

    if (!hub) {
      throw new Error('Cannot find hub!');
    }

    // get all cars belong to hub or current at hub
    const cars = await Car.find({
      $or: [{ currentHub: hub._id }, { hub: hub._id }],
      isActive: true,
    }).populate('carModel');
    const carIds = cars.map(item => item._id.toString());

    // get all rentals in the future
    const rentals = await Rental.find({
      car: { $in: carIds },
      fromDate: { $gte: new Date() },
    });
    const rentalIds = rentals.map(item => item.car.toString());

    // find all lease in the future
    const upcommingLease = await Lease.find({
      hub: hub._id,
      startDate: { $gte: new Date() },
    });

    const leasesIds = upcommingLease.map(item => item.car.toString());

    // merge car with rental
    const allCarFromHub = cars.map(car => {
      if (rentalIds.includes(car._id.toString())) {
        return {
          ...car.toJSON(),
          rental: rentals
            .find(rental => rental.car.toString() === car._id.toString())
            .toJSON(),
        };
      }

      if (leasesIds.includes(car._id.toString())) {
        return {
          ...car.toJSON(),
          lease: upcommingLease.find(
            lease => lease.car.toString() === car._id.toString()
          ),
        };
      }
      return car.toJSON();
    });

    return res.status(httpStatus.OK).json({ allCarFromHub, hub });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};
