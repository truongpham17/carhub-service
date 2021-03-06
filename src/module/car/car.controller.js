import httpStatus from 'http-status';
import moment from 'moment';
import Car from './car.model';
import Hub from '../hub/hub.model';
import Rental from '../rental/rental.model';
import Lease from '../lease/lease.model';
import {
  CAR_CURRENTLY_LEASING,
  RENTAL_NOT_FOUND_CAR,
  RENTAL_CAR_ALREADY_IN_USE,
  RENTAL_CAR_NOT_MATCH_ADDRESS,
  RENTAL_NOT_FOUND_RENTAL,
  RENTAL_NOT_MATCH_CAR_MODEL,
} from '../../constant/errorCode';

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
    return res.status(httpStatus.OK).json(car);
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
          currentHub: fromHub._id,
        });
        if (car) {
          car.currentHub = toHub._id;
          car.note = `Được chuyển từ Hub "${fromHub.name}" đến Hub "${
            toHub.name
          }" vào lúc ${moment().format('h:mm:ss A DD-MM-YYYY')}`;
          await car.save();
          return car;
        }
        throw new Error('Car not found');
      })
    );

    return res.status(httpStatus.OK).json(carList);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const createLeasingCar = async (req, res) => {
  try {
    const checkCar = await Car.findOne({ VIN: req.body.vin });
    if (checkCar) {
      const inProgressLease = await Lease.findOne({
        car: checkCar._id,
        status: { $ne: 'PAST' },
      });

      if (inProgressLease) {
        throw new Error(CAR_CURRENTLY_LEASING);
      }

      Object.keys(req.body).forEach(key => {
        checkCar[key] = req.body[key];
      });
      await checkCar.save();
      return res.status(httpStatus.OK).json(checkCar);
    }
    const car = await Car.create(req.body);
    return res.status(httpStatus.CREATED).json(car);
  } catch (error) {
    console.log(error.message);
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
    }).populate('carModel customer');
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

export const checkAvailableCarForRental = async (req, res) => {
  try {
    const { employee } = req;
    const { id, rentalId } = req.params;
    const carObj = await Car.findById(id).populate('carModel');

    // if car not found
    if (!carObj) {
      throw new Error(RENTAL_NOT_FOUND_CAR);
    }

    if (!carObj.currentHub) {
      throw new Error(RENTAL_CAR_ALREADY_IN_USE);
    }

    // if car not belong to hub
    if (carObj.currentHub.toString() !== employee.hub.toString()) {
      throw new Error(RENTAL_CAR_NOT_MATCH_ADDRESS);
    }

    // if rental not found
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      throw new Error(RENTAL_NOT_FOUND_RENTAL);
    }

    let isNotMatch = false;

    // if rental and car not match model
    if (carObj.carModel._id.toString() !== rental.carModel.toString()) {
      // rental.carModel = carObj.carModel._id.toString();
      // await rental.save();
      isNotMatch = true;
      // throw new Error(RENTAL_NOT_MATCH_CAR_MODEL);
    }

    // if this car already in use
    const rentalDuplicate = await Rental.findOne({
      car: id,
      status: { $in: ['CURRENT', 'SHARING', 'SHARED'] },
    });

    if (rentalDuplicate) {
      throw new Error(RENTAL_CAR_ALREADY_IN_USE);
    }

    return res.status(httpStatus.OK).json({ ...carObj.toJSON(), isNotMatch });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};
