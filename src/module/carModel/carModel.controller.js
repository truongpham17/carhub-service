import httpStatus from 'http-status';
import CarModel from './carModel.model';
import Hub from '../hub/hub.model';
import Car from '../car/car.model';
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
    const { startLocation } = req.body;
    const { lat, lng } = startLocation.geometry;

    const hubs = await Hub.find({});

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

    const hubFilter = hubsPlusDistance.filter(hub => hub.distance < 30);
    const data = [];
    await Promise.all(
      hubFilter.map(async hub => {
        const modelIds = await Car.find({ currentHub: hub._id }).distinct(
          'carModel'
        );
        const carModels = await CarModel.find({ _id: modelIds });
        if (carModels.length > 0) {
          carModels.forEach(item => {
            data.push({ hub, carModel: item });
          });
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
    const carModel = await CarModel.findByIdAndUpdate({ _id: id }, req.body);
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Updated successfully!', carModel });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error.messages);
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
