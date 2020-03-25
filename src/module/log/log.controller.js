import httpStatus from 'http-status';
import Log from './log.model';

export const getLogList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const logs = await Log.find()
      .limit(limit)
      .skip(skip);
    const total = await Log.count();
    return res.status(httpStatus.OK).json({ logs, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const getGroupingLog = async (req, res) => {
  const { id } = req.params;
  try {
    const logs = await Log.find({ detail: id });
    return res.status(httpStatus.OK).json(logs);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const getLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById({ _id: id });
    if (!log) {
      throw new Error('Log not found!');
    }
    return res.status(httpStatus.OK).json(log);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const createLog = async (req, res) => {
  try {
    console.log(req.body);
    const log = await Log.create(req.body);
    return res.status(httpStatus.CREATED).json(log);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id);
    Object.keys(req.body).forEach(key => {
      log[key] = req.body[key];
    });
    await log.save();
    return res.status(httpStatus.OK).json(log);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const removeLog = async (req, res) => {
  try {
    const { id } = req.params;
    await Log.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.json(httpStatus.OK).json({ msg: 'Deteled successfully!' });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};
