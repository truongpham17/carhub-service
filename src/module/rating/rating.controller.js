import httpStatus from 'http-status';
import Rating from './rating.model';

export const getRating = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const ratings = await Rating.find()
      .limit(limit)
      .skip(skip);
    const total = await Rating.count();
    return res.status(httpStatus.OK).json({ ratings, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findById({ _id: id });
    if (!rating) {
      throw new Error('Rating not found!');
    }
    return res.status(httpStatus.OK).json({ rating });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const createRating = async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Created successfully!', rating });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByIdAndUpdate({ _id: id }, req.body);
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Update successfully!', rating });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const removeRating = async (req, res) => {
  try {
    const { id } = req.params;
    await Rating.findByIdAndUpdate({ _id: id });
    return res.json(httpStatus.OK).json({ msg: 'Deteled successfully!' });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};
