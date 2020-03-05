import httpStatus from 'http-status';
import CarModel from './carModel.model';

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

export const getCarModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const carModel = await CarModel.findById({ _id: id });
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
      .status(httpStatus.OK)
      .json({ msg: 'Created successfully!', carModel });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.messages);
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
