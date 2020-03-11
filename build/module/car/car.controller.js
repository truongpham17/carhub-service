"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCarByVin = exports.removeCar = exports.updateCar = exports.createCar = exports.getCarByHub = exports.getCarByCustomer = exports.getCarById = exports.getCarList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _car = _interopRequireDefault(require("./car.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCarList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;

  try {
    const cars = await _car.default.find().skip(skip).limit(limit).populate('carModel hub currentHub');
    const total = await _car.default.count();
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
    let cars;

    switch (req.user.role) {
      case 'CUSTOMER':
        cars = await _car.default.find({
          customer: id
        });
        break;
      // case 'MANAGER':
      //   cars = await

      default:
        cars = await _car.default.findById({
          _id: id
        });
    }

    return res.status(_httpStatus.default.OK).json({
      cars
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarById = getCarById;

const getCarByCustomer = async (req, res) => {
  try {
    const {
      customerId
    } = req.params;
    const car = await _car.default.findOne({
      customer: customerId,
      isActive: true
    });

    if (!car) {
      throw new Error('Car not found');
    }

    return res.status(_httpStatus.default.OK).json({
      car
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarByCustomer = getCarByCustomer;

const getCarByHub = async (req, res) => {
  try {
    const {
      hubId
    } = req.params;
    const car = await _car.default.findOne({
      customer: hubId,
      isActive: true
    });

    if (!car) {
      throw new Error('Car not found');
    }

    return res.status(_httpStatus.default.OK).json({
      car
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.getCarByHub = getCarByHub;

const createCar = async (req, res) => {
  try {
    const car = await _car.default.create(req.body);
    return res.status(_httpStatus.default.OK).json({
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
    const car = await _car.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Updated successfully!',
      car
    });
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.message);
  }
};

exports.updateCar = updateCar;

const removeCar = async (req, res) => {
  try {
    const {
      id
    } = req.params;
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

exports.checkCarByVin = checkCarByVin;