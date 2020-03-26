import HTTPStatus from 'http-status';
import Sharing from './sharing.model';
import RentalSharingRequest from '../rental-sharing-request/rentalSharingRequest.model';
import Rental from '../rental/rental.model';

export const getSharing = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const sharing = await Sharing.find({ isActive: true, customer: null })
      .skip(skip)
      .limit(limit)
      .populate('rental customer')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      });
    const total = await Sharing.countDocuments({ isActive: true });
    return res.status(HTTPStatus.OK).json({ sharing, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const getSharingByRentalId = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.find({ rental: id, isActive: true })
      .populate('rental customer')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      });
    return res.status(HTTPStatus.OK).json(sharing);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const getLatestSharingByRental = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.find({ rental: id, isActive: true })
      .sort({
        createdAt: -1,
      })
      .populate('rental customer')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      });
    return res.status(HTTPStatus.OK).json(sharing[0]);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const confirmSharing = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestId } = req.body;

    const sharingRequest = await RentalSharingRequest.findById(requestId);
    if (!sharingRequest) {
      console.log('1');
      throw new Error('Can not find share request!');
    }

    const rental = await Rental.findById(id);

    if (!rental) {
      console.log('3');
      throw new Error('Cannot find rental');
    }

    const sharing = await Sharing.findOne({ rental: rental._id });

    if (!sharing) {
      console.log('2');
      throw new Error('Cannot find sharing');
    }

    sharing.sharingRequest = sharingRequest;

    rental.status = 'SHARED';

    sharingRequest.status = 'CURRENT';

    await sharingRequest.save();
    await sharing.save();
    await rental.save();

    return res.status(HTTPStatus.OK).json({});
  } catch (error) {
    console.log(error.message);
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const removeLatestSharingByRental = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.find({ rental: id, isActive: true })
      .sort({ createdAt: -1 })
      .populate('rental customer')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      });
    const latest = sharing[0];
    latest.isActive = false;
    await latest.save();
    return res.status(HTTPStatus.OK).json(latest);
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
