import httpStatus from 'http-status';
import Hub from './hub.model';

export const getHub = async (req, res) => {
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
    return res.status(httpStatus.OK).json({ hub });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const createHub = async (req, res) => {
  try {
    const hub = await Hub.create(req.body);
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Created successfully!', hub });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateHub = async (req, res) => {
  try {
    const { id } = req.params;
    const hub = await Hub.findByIdAndUpdate({ _id: id }, req.body);
    return res.status(httpStatus.OK).json({ msg: 'Update successfully!', hub });
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
