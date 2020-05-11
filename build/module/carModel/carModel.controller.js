"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findCarModelByName = exports.createCarModelBySendingLease = exports.removeCarModel = exports.transferCarModel = exports.updateCarModel = exports.createCarModel = exports.getCarModelByVin = exports.getCarModelById = exports.searchNearByCarModel = exports.getCarModelList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _carModel = _interopRequireDefault(require("./carModel.model"));

var _hub = _interopRequireDefault(require("../hub/hub.model"));

var _car = _interopRequireDefault(require("../car/car.model"));

var _rental = _interopRequireDefault(require("../rental/rental.model"));

var _distance = require("../../utils/distance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCarModelList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const carModels = await _carModel.default.find().skip(skip).limit(limit);
    const total = await _carModel.default.count();
    return res.status(_httpStatus.default.OK).json({
      carModels,
      total
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.getCarModelList = getCarModelList;

const searchNearByCarModel = async (req, res) => {
  try {
    const {
      startLocation,
      startDate,
      endDate
    } = req.body;
    const {
      lat,
      lng
    } = startLocation.geometry;
    const hubs = await _hub.default.find({}); // sort hub by distance

    const hubsPlusDistance = hubs.map(hub => ({ ...hub.toJSON(),
      distance: (0, _distance.distanceInKmBetweenEarthCoordinates)(hub.geometry.lat, hub.geometry.lng, lat, lng)
    })).sort((a, b) => a.distance - b.distance); // filter all hub nearby user (<30km)

    const hubFilter = hubsPlusDistance.filter(hub => hub.distance < 30);
    const hubWithRealDistance = [];

    for (let i = 0; i < hubFilter.length; i++) {
      const hubItem = hubFilter[i];
      const response = await (0, _nodeFetch.default)(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${hubItem.geometry.lat},${hubItem.geometry.lng}&destinations=${lat},${lng}&key=AIzaSyAUkXe8bNKtkVADuufFsYQZGrTpxWQCW4Y`);
      const mapData = await response.json();

      try {
        if (mapData.rows[0].elements[0].distance.value) {
          const {
            value
          } = mapData.rows[0].elements[0].distance;

          if (value < 30000) {
            console.log('add new');
            hubWithRealDistance.push({ ...hubItem,
              distance: value / 1000
            });
          }
        }
      } catch (error) {}
    }

    console.log(hubWithRealDistance);
    const data = []; // find car model of each hub

    await Promise.all(hubWithRealDistance.map(async hub => {
      // find all car model from hub (currently having car)
      const modelIds = await _car.default.find({
        currentHub: hub._id
      }).distinct('carModel');
      const carModels = await _carModel.default.find({
        _id: modelIds
      });

      if (carModels.length > 0) {
        // each car model at hub
        for (let i = 0; i < carModels.length; i++) {
          const item = carModels[i];
          const currentCarCount = await _car.default.countDocuments({
            currentHub: hub._id,
            carModel: item._id
          });
          const goingOutCarCount = await _rental.default.countDocuments({
            startDate: {
              $lte: startDate
            },
            endDate: {
              $gte: startDate
            },
            status: 'UPCOMING',
            carModel: item._id
          });

          if (currentCarCount - goingOutCarCount > 0) {
            data.push({
              hub,
              carModel: item
            });
          }
        }
      }
    }));
    return res.status(_httpStatus.default.OK).json(data);
  } catch (error) {
    console.log('error!!!!');
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.searchNearByCarModel = searchNearByCarModel;

const getCarModelById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const carModel = await _carModel.default.findById({
      _id: id
    });

    if (!carModel) {
      throw new Error('CarModel is not found!');
    }

    return res.status(_httpStatus.default.OK).json({
      carModel
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.getCarModelById = getCarModelById;

const getCarModelByVin = async (req, res) => {
  try {
    const {
      vin
    } = req.params;
    const carModel = await _carModel.default.find({
      VIN: vin
    });
    return res.status(_httpStatus.default.OK).json({
      carModel
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.getCarModelByVin = getCarModelByVin;

const createCarModel = async (req, res) => {
  try {
    const carModel = await _carModel.default.create(req.body);
    return res.status(_httpStatus.default.CREATED).json({
      msg: 'Created successfully!',
      carModel
    });
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error);
  }
};

exports.createCarModel = createCarModel;

const updateCarModel = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const carModel = await _carModel.default.findById(id);
    Object.keys(req.body).forEach(key => {
      carModel[key] = req.body[key];
    });
    await carModel.save();
    return res.status(_httpStatus.default.OK).json(carModel);
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};
/*
  body: {
    fromHub
    toHub
    list {
      _id
      quantity
    }
  }
 */


exports.updateCarModel = updateCarModel;

const transferCarModel = async (req, res) => {
  try {
    const {
      fromHub,
      toHub,
      list
    } = req.body;
    const carList = await Promise.all(list.map(async carModel => {
      const cars = await _car.default.find({
        customer: null,
        currentHub: fromHub,
        carModel: carModel._id
      }).limit(carModel.quantity);

      if (!cars) {
        throw new Error('Car not found!');
      }

      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.currentHub = toHub;
        await car.save();
      }

      return cars;
    }));
    return res.status(_httpStatus.default.OK).json(carList);
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.transferCarModel = transferCarModel;

const removeCarModel = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await _carModel.default.findByIdAndUpdate({
      _id: id
    }, {
      isActive: false
    });
    return res.status(_httpStatus.default.OK).json({
      msg: 'Deleted successfully!'
    });
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.removeCarModel = removeCarModel;

const createCarModelBySendingLease = async (req, res) => {
  try {
    const {
      name
    } = req.params;
    const carModelExisted = await _carModel.default.findOne({
      name: new RegExp(`${name}`, 'i')
    });

    if (!carModelExisted) {
      const carModel = await _carModel.default.create(req.body);
      return res.status(_httpStatus.default.CREATED).json(carModel);
    }

    return res.status(_httpStatus.default.CREATED).json(carModelExisted);
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.createCarModelBySendingLease = createCarModelBySendingLease;

const findCarModelByName = async (req, res) => {
  try {
    const {
      name
    } = req.params;
    const carModel = await _carModel.default.findOne({
      name: new RegExp(`${name}`, 'i')
    });
    return res.status(_httpStatus.default.OK).json(carModel);
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.findCarModelByName = findCarModelByName;