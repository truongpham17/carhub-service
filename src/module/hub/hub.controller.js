import httpStatus from 'http-status';
import Hub from './hub.model';
import Car from '../car/car.model';

export const getHubList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const hubs = await Hub.find()
      .limit(limit)
      .skip(skip);
    const total = await Hub.count();
    return res.status(httpStatus.OK).json({ hubs, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const getHubById = async (req, res) => {
  try {
    const { id } = req.params;
    const hub = await Hub.findById({ _id: id });
    if (!hub) {
      throw new Error('Hub not found!');
    }
    const cars = await Car.find({ currentHub: hub._id.toString() }).populate(
      'carModel customer'
    );

    return res.status(httpStatus.OK).json({ ...hub.toJSON(), cars });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const createHub = async (req, res) => {
  try {
    const hub = await Hub.create(req.body);
    return res
      .status(httpStatus.CREATED)
      .json({ msg: 'Created successfully!', hub });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateHub = async (req, res) => {
  try {
    const { id } = req.params;
    const hub = await Hub.findById(id);
    Object.keys(req.body).forEach(key => {
      hub[key] = req.body[key];
    });
    await hub.save();
    return res.status(httpStatus.OK).json(hub);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const removeHub = async (req, res) => {
  try {
    const { id } = req.params;
    await Hub.findByIdAndUpdate({ _id: id });
    return res.json(httpStatus.OK).json({ msg: 'Deteled successfully!' });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};
