import HTTPStatus from 'http-status';
import CarMapping from './carmapping.model';

export const getCarMapping = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const carmappings = await CarMapping.find()
    .skip(skip)
    .limit(limit);
  const total = await CarMapping.count();
  return res.json({ carmappings, total });
};

export const getCarMappingById = async (req, res) => {
  const { id } = req.params;
  const carmapping = await CarMapping.findById({ _id: id });
  return res.json({ carmapping });
};

export const getCarMappingByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const carmapping = await CarMapping.findOne({
      customer: customerId,
      isActive: true,
    });
    if (!carmapping) {
      throw new Error('CarMapping not found');
    }
    return res.status(HTTPStatus.OK).json({ carmapping });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCarMappingByHub = async (req, res) => {
  try {
    const { customerId } = req.params;
    const carmapping = await CarMapping.findOne({
      customer: customerId,
      isActive: true,
    });
    if (!carmapping) {
      throw new Error('CarMapping not found');
    }
    return res.status(HTTPStatus.OK).json({ carmapping });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createCarMapping = async (req, res) => {
  const carmapping = await CarMapping.create(req.body);
  return res.json({ msg: 'Created successfully!', carmapping });
};

export const updateCarMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const carmapping = await CarMapping.findByIdAndUpdate(
      { _id: id },
      req.body
    );
    return res.json({ msg: 'Updated successfully!', carmapping });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const removeCarMapping = async (req, res) => {
  try {
    const { id } = req.params;
    await CarMapping.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.json({ msg: 'Deleted successfully!s' });
  } catch (error) {
    res.status(404).json(error);
  }
};
