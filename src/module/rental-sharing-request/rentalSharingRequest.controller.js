import HTTPStatus from 'http-status';
import RentalSharingRequest from './rentalSharingRequest.model';

export const getRentalSharingRequest = async (req, res) => {
  try {
    const requestList = await RentalSharingRequest.find({
      isActive: true,
    })
      .populate('customer sharing')
      .populate({ path: 'sharing', populate: { path: 'rental' } });
    return res.status(HTTPStatus.OK).json(requestList);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const addRentalSharingRequest = async (req, res) => {
  try {
    const rentalRequest = await RentalSharingRequest.create(req.body);
    return res.status(HTTPStatus.OK).json(rentalRequest);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const updateRentalSharingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestList = await RentalSharingRequest.findById(id);
    Object.keys(req.body).forEach(key => (requestList[key] = req.body[key]));
    await requestList.save();
    return res.status(HTTPStatus.OK).json(requestList);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const deleteRentalSharingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const rentalRequest = await RentalSharingRequest.findByIdAndUpdate({
      _id: id,
      isActive: false,
    });
    return res.status(HTTPStatus.OK).json(rentalRequest);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};
