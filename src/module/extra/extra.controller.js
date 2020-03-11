import httpStatus from 'http-status';
import Extra from './extra.model';

export const getExtra = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const extras = await Extra.find({ isActive: true })
      .skip(skip)
      .limit(limit);
    const total = await Extra.countDocuments({ isActive: true });
    return res.status(httpStatus.OK).json({ extras, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const getExtraById = async (req, res) => {
  try {
    const { id } = req.params;
    const extra = await Extra.findById(id);
    if (!extra) {
      throw new Error('Extra is not found!');
    }
    return res.status(httpStatus.OK).json(extra);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const createExtra = async (req, res) => {
  try {
    const { content, price } = req.body;
    const extra = await Extra.create({ content, price });
    return res.status(httpStatus.CREATED).json({ msg: 'Created!', extra });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const updateExtra = async (req, res) => {
  try {
    const { id } = req.params;
    const extra = await Extra.findByIdAndUpdate({ _id: id }, req.body);
    return res.status(httpStatus.OK).json({ msg: 'Updated!', extra });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const removeExtra = async (req, res) => {
  try {
    const { id } = req.params;
    await Extra.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.status(httpStatus.OK).json({ msg: 'Deleted!' });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
