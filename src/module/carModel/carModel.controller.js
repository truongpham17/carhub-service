import httpStatus from 'http-status';
import fetch from 'node-fetch';
import CarModel from './carModel.model';
import Hub from '../hub/hub.model';
import Car from '../car/car.model';
import Rental from '../rental/rental.model';
import { distanceInKmBetweenEarthCoordinates } from '../../utils/distance';

export const getCarModelList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const carModels = await CarModel.find()
      .skip(skip)
      .limit(limit);
    const total = await CarModel.count();
    return res.status(httpStatus.OK).json({ carModels, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const searchNearByCarModel = async (req, res) => {
  try {
    const { startLocation, startDate, endDate } = req.body;
    const { lat, lng } = startLocation.geometry;

    const hubs = await Hub.find({});

    // sort hub by distance
    const hubsPlusDistance = hubs
      .map(hub => ({
        ...hub.toJSON(),
        distance: distanceInKmBetweenEarthCoordinates(
          hub.geometry.lat,
          hub.geometry.lng,
          lat,
          lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    // filter all hub nearby user (<30km)
    const hubFilter = hubsPlusDistance.filter(hub => hub.distance < 30);
    const hubWithRealDistance = [];
    for (let i = 0; i < hubFilter.length; i++) {
      const hubItem = hubFilter[i];
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${
          hubItem.geometry.lat
        },${
          hubItem.geometry.lng
        }&destinations=${lat},${lng}&key=AIzaSyAUkXe8bNKtkVADuufFsYQZGrTpxWQCW4Y`
      );
      const mapData = await response.json();
      try {
        if (mapData.rows[0].elements[0].distance.value) {
          const { value } = mapData.rows[0].elements[0].distance;
          if (value < 30000) {
            console.log('add new');
            hubWithRealDistance.push({ ...hubItem, distance: value / 1000 });
          }
        }
      } catch (error) {}
    }

    console.log(hubWithRealDistance);

    const data = [];

    // find car model of each hub
    await Promise.all(
      hubWithRealDistance.map(async hub => {
        // find all car model from hub (currently having car)
        const modelIds = await Car.find({ currentHub: hub._id }).distinct(
          'carModel'
        );

        const carModels = await CarModel.find({ _id: modelIds });
        if (carModels.length > 0) {
          // each car model at hub
          for (let i = 0; i < carModels.length; i++) {
            const item = carModels[i];
            const currentCarCount = await Car.countDocuments({
              currentHub: hub._id,
              carModel: item._id,
            });
            const goingOutCarCount = await Rental.countDocuments({
              startDate: { $lte: startDate },
              endDate: { $gte: startDate },
              status: 'UPCOMING',
              carModel: item._id,
            });

            if (currentCarCount - goingOutCarCount > 0) {
              data.push({ hub, carModel: item });
            }
          }
        }
      })
    );

    return res.status(httpStatus.OK).json(data);
  } catch (error) {
    console.log('error!!!!');
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const getCarModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const carModel = await CarModel.findById({ _id: id });
    if (!carModel) {
      throw new Error('CarModel is not found!');
    }
    return res.status(httpStatus.OK).json({ carModel });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const getCarModelByVin = async (req, res) => {
  try {
    const { vin } = req.params;
    const carModel = await CarModel.find({ VIN: vin });
    return res.status(httpStatus.OK).json({ carModel });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const createCarModel = async (req, res) => {
  try {
    const carModel = await CarModel.create(req.body);
    return res
      .status(httpStatus.CREATED)
      .json({ msg: 'Created successfully!', carModel });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const updateCarModel = async (req, res) => {
  try {
    const { id } = req.params;
    const carModel = await CarModel.findById(id);
    Object.keys(req.body).forEach(key => {
      carModel[key] = req.body[key];
    });
    await carModel.save();
    return res.status(httpStatus.OK).json(carModel);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error.messages);
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
export const transferCarModel = async (req, res) => {
  try {
    const { fromHub, toHub, list } = req.body;
    const carList = await Promise.all(
      list.map(async carModel => {
        const cars = await Car.find({
          customer: null,
          currentHub: fromHub,
          carModel: carModel._id,
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
      })
    );

    return res.status(httpStatus.OK).json(carList);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const removeCarModel = async (req, res) => {
  try {
    const { id } = req.params;
    await CarModel.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.status(httpStatus.OK).json({ msg: 'Deleted successfully!' });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const createCarModelBySendingLease = async (req, res) => {
  try {
    const { name } = req.params;
    const carModelExisted = await CarModel.findOne({
      name: new RegExp(`${name}`, 'i'),
    });
    if (!carModelExisted) {
      const carModel = await CarModel.create(req.body);
      return res.status(httpStatus.CREATED).json(carModel);
    }
    return res.status(httpStatus.CREATED).json(carModelExisted);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};

export const findCarModelByName = async (req, res) => {
  try {
    const { name } = req.params;
    const carModel = await CarModel.findOne({
      name: new RegExp(`${name}`, 'i'),
    });
    return res.status(httpStatus.OK).json(carModel);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error.messages);
  }
};
