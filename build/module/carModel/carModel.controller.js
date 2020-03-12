"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCarModel = exports.updateCarModel = exports.createCarModel = exports.getCarModelByVin = exports.getCarModelById = exports.searchNearByCarModel = exports.getCarModelList = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _carModel = _interopRequireDefault(require("./carModel.model"));

var _hub = _interopRequireDefault(require("../hub/hub.model"));

var _car = _interopRequireDefault(require("../car/car.model"));

var _distance = require("../../utils/distance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCarModelList = async (req, res) => {
  console.log('serach list');

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
    console.log(req.body);
    const {
      startLocation
    } = req.body;
    const {
      lat,
      lng
    } = startLocation.geometry;
    const hubs = await _hub.default.find({});
    const hubsPlusDistance = hubs.map(hub => ({ ...hub.toJSON(),
      distance: (0, _distance.distanceInKmBetweenEarthCoordinates)(hub.geometry.lat, hub.geometry.lng, lat, lng)
    })).sort((a, b) => a.distance - b.distance);
    const hubFilter = hubsPlusDistance.filter(hub => hub.distance < 30);
    console.log(hubFilter);
    const data = [];
    await Promise.all(hubFilter.map(async hub => {
      const modelIds = await _car.default.find({
        currentHub: hub._id
      }).distinct('carModel');
      const carModels = await _carModel.default.find({
        _id: modelIds
      });

      if (carModels.length > 0) {
        carModels.forEach(item => {
          data.push({
            hub,
            carModel: item
          });
        });
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
    console.log(id);
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
    const carModel = await _carModel.default.findByIdAndUpdate({
      _id: id
    }, req.body);
    return res.status(_httpStatus.default.OK).json({
      msg: 'Updated successfully!',
      carModel
    });
  } catch (error) {
    res.status(_httpStatus.default.BAD_REQUEST).json(error.messages);
  }
};

exports.updateCarModel = updateCarModel;

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