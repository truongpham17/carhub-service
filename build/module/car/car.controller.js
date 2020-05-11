"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAvailableCarForRental = exports.getHubCarList = exports.createLeasingCar = exports.transferLeasingCar = exports.checkCarByVin = exports.removeCar = exports.updateCar = exports.createCar = exports.getCarsByHub = exports.getCustomerPreviousCarList = exports.getCarsByCustomer = exports.getCarById = exports.getCarList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _moment = _interopRequireDefault(require("moment"));

var _car = _interopRequireDefault(require("./car.model"));

var _hub = _interopRequireDefault(require("../hub/hub.model"));

var _rental = _interopRequireDefault(require("../rental/rental.model"));

var _lease = _interopRequireDefault(require("../lease/lease.model"));

var _errorCode = require("../../constant/errorCode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCarList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    let cars;
    let total;

    switch (req.user.role) {
      case 'CUSTOMER':
        cars = await _car.default.find({
          customer: req.customer._id
        }).skip(skip).limit(limit).populate('carModel hub currentHub');
        total = await _car.default.count({
          customer: req.customer._id
        });
        break;

      case 'EMPLOYEE':
      case 'MANAGER':
        cars = await _car.default.find().skip(skip).limit(limit).populate('carModel hub currentHub');
        total = await _car.default.count();
        break;

      default:
        throw new Error('Role is not existed!');
    }

    return res.status(_httpStatus.default.OK).json({
      cars,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarList = getCarList;

const getCarById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const car = await _car.default.findById({
      _id: id
    }).populate('carModel hub currentHub');

    if (!car) {
      throw new Error('Car not found!');
    }

    return res.status(_httpStatus.default.OK).json(car);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarById = getCarById;

const getCarsByCustomer = async (req, res) => {
  try {
    const {
      customerId
    } = req.params;
    const car = await _car.default.findOne({
      customer: customerId,
      isActive: true
    });

    if (!car) {
      throw new Error('Car is not found!');
    }

    return res.status(_httpStatus.default.OK).json({
      car
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarsByCustomer = getCarsByCustomer;

const getCustomerPreviousCarList = async (req, res) => {
  try {
    const cars = await _car.default.find({
      customer: req.customer._id,
      isActive: true
    }).populate('carModel');

    if (!cars) {
      throw new Error('Car is not found!');
    }

    return res.status(_httpStatus.default.OK).json(cars);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCustomerPreviousCarList = getCustomerPreviousCarList;

const getCarsByHub = async (req, res) => {
  try {
    const {
      hubId
    } = req.params;
    const cars = await _car.default.find({
      hub: hubId
    });

    if (!cars) {
      throw new Error('Car is not found');
    }

    const total = await _car.default.count({
      hub: hubId
    });
    return res.status(_httpStatus.default.OK).json({
      cars,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarsByHub = getCarsByHub;

const createCar = async (req, res) => {
  try {
    const car = await _car.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json({
      msg: 'Created successfully!',
      car
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createCar = createCar;

const updateCar = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const car = await _car.default.findById(id);
    Object.keys(req.body).forEach(key => {
      car[key] = req.body[key];
    });
    await car.save();
    return res.status(_httpStatus.default.OK).json(car);
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.updateCar = updateCar;

const removeCar = async (req, res) => {
  try {
    const {
      id
    } = req.params.id;
    await _car.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Deleted successfully!s'
    });
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.removeCar = removeCar;

const checkCarByVin = async (req, res) => {
  try {
    const {
      vin
    } = req.params;
    const car = await _car.default.find({
      VIN: vin
    });
    return res.status(_httpStatus.default.OK).json({
      car
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
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


exports.checkCarByVin = checkCarByVin;

const transferLeasingCar = async (req, res) => {
  try {
    const {
      fromHub,
      toHub,
      list
    } = req.body;
    const carList = await Promise.all(list.map(async item => {
      const car = await _car.default.findOne({
        _id: item._id,
        currentHub: fromHub._id
      });

      if (car) {
        car.currentHub = toHub._id;
        car.note = `Được chuyển từ Hub "${fromHub.name}" đến Hub "${toHub.name}" vào lúc ${(0, _moment.default)().format('h:mm:ss A DD-MM-YYYY')}`;
        await car.save();
        return car;
      }

      throw new Error('Car not found');
    }));
    return res.status(_httpStatus.default.OK).json(carList);
  } catch (error) {
    console.log(error);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.transferLeasingCar = transferLeasingCar;

const createLeasingCar = async (req, res) => {
  try {
    const checkCar = await _car.default.findOne({
      VIN: req.body.vin
    });

    if (checkCar) {
      const inProgressLease = await _lease.default.findOne({
        car: checkCar._id,
        status: {
          $ne: 'PAST'
        }
      });

      if (inProgressLease) {
        throw new Error(_errorCode.CAR_CURRENTLY_LEASING);
      }

      Object.keys(req.body).forEach(key => {
        checkCar[key] = req.body[key];
      });
      await checkCar.save();
      return res.status(_httpStatus.default.OK).json(checkCar);
    }

    const car = await _car.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json(car);
  } catch (error) {
    console.log(error.message);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.createLeasingCar = createLeasingCar;

const getHubCarList = async (req, res) => {
  try {
    if (!req.employee) {
      throw new Error('Accept denined!');
    }

    const hub = await _hub.default.findById(req.employee.hub);

    if (!hub) {
      throw new Error('Cannot find hub!');
    } // get all cars belong to hub or current at hub


    const cars = await _car.default.find({
      $or: [{
        currentHub: hub._id
      }, {
        hub: hub._id
      }],
      isActive: true
    }).populate('carModel customer');
    const carIds = cars.map(item => item._id.toString()); // get all rentals in the future

    const rentals = await _rental.default.find({
      car: {
        $in: carIds
      },
      fromDate: {
        $gte: new Date()
      }
    });
    const rentalIds = rentals.map(item => item.car.toString()); // find all lease in the future

    const upcommingLease = await _lease.default.find({
      hub: hub._id,
      startDate: {
        $gte: new Date()
      }
    });
    const leasesIds = upcommingLease.map(item => item.car.toString()); // merge car with rental

    const allCarFromHub = cars.map(car => {
      if (rentalIds.includes(car._id.toString())) {
        return { ...car.toJSON(),
          rental: rentals.find(rental => rental.car.toString() === car._id.toString()).toJSON()
        };
      }

      if (leasesIds.includes(car._id.toString())) {
        return { ...car.toJSON(),
          lease: upcommingLease.find(lease => lease.car.toString() === car._id.toString())
        };
      }

      return car.toJSON();
    });
    return res.status(_httpStatus.default.OK).json({
      allCarFromHub,
      hub
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getHubCarList = getHubCarList;

const checkAvailableCarForRental = async (req, res) => {
  try {
    const {
      employee
    } = req;
    const {
      id,
      rentalId
    } = req.params;
    const carObj = await _car.default.findById(id).populate('carModel'); // if car not found

    if (!carObj) {
      throw new Error(_errorCode.RENTAL_NOT_FOUND_CAR);
    }

    if (!carObj.currentHub) {
      throw new Error(_errorCode.RENTAL_CAR_ALREADY_IN_USE);
    } // if car not belong to hub


    if (carObj.currentHub.toString() !== employee.hub.toString()) {
      throw new Error(_errorCode.RENTAL_CAR_NOT_MATCH_ADDRESS);
    } // if rental not found


    const rental = await _rental.default.findById(rentalId);

    if (!rental) {
      throw new Error(_errorCode.RENTAL_NOT_FOUND_RENTAL);
    }

    let isNotMatch = false; // if rental and car not match model

    if (carObj.carModel._id.toString() !== rental.carModel.toString()) {
      // rental.carModel = carObj.carModel._id.toString();
      // await rental.save();
      isNotMatch = true; // throw new Error(RENTAL_NOT_MATCH_CAR_MODEL);
    } // if this car already in use


    const rentalDuplicate = await _rental.default.findOne({
      car: id,
      status: {
        $in: ['CURRENT', 'SHARING', 'SHARED']
      }
    });

    if (rentalDuplicate) {
      throw new Error(_errorCode.RENTAL_CAR_ALREADY_IN_USE);
    }

    return res.status(_httpStatus.default.OK).json({ ...carObj.toJSON(),
      isNotMatch
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.checkAvailableCarForRental = checkAvailableCarForRental;