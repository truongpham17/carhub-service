import HTTPStatus from 'http-status';
import Sharing from './sharing.model';

export const getSharing = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const sharing = await Sharing.find({ isActive: true, requestUser: null })
      .skip(skip)
      .limit(limit)
      .populate('rental')
      .populate({ path: 'rental', populate: { path: 'carModel' } });
    const total = await Sharing.countDocuments({ isActive: true });
    return res.status(HTTPStatus.OK).json({ sharing, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const getSharingById = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.findById(id).populate('rental');
    return res.status(HTTPStatus.OK).json(sharing);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const addSharing = async (req, res) => {
  try {
    const sharing = await Sharing.create(req.body);
    return res.status(HTTPStatus.OK).json(sharing);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const updateSharing = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.findById(id);
    Object.keys(req.body).forEach(key => (sharing[key] = req.body[key]));
    await sharing.save();
    return res.status(HTTPStatus.OK).json(sharing);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const removeSharing = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.findByIdAndUpdate(
      { _id: id },
      { isActive: false }
    );
    return res.status(HTTPStatus.OK).json(sharing);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};