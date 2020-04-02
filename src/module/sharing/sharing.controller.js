import HTTPStatus from 'http-status';
import Sharing from './sharing.model';
import RentalSharingRequest from '../rental-sharing-request/rentalSharingRequest.model';
import Rental from '../rental/rental.model';
import { distanceInKmBetweenEarthCoordinates } from '../../utils/distance';

export const getSharing = async (req, res) => {
  try {
    const { id: customerId } = req.customer;
    if (!customerId) {
      throw new Error('Access denied');
    }

    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    const { startLocation, endLocation, startDate, endDate } = req.body;

    const { lat: startLat, lng: startLng } = startLocation.geometry;
    const { lat: endLat, lng: endLng } = endLocation.geometry;

    const sharings = await Sharing.find({
      isActive: true,
      customer: null,
      fromDate: { $gte: startDate },
      toDate: { $lte: endDate },
    })
      .skip(skip)
      .limit(limit)
      .populate('rental customer sharingRequest')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      })
      .populate({
        path: 'sharingRequest',
        populate: { path: 'customer' },
      });

    // only show result if the endLocation near return hub, or the startLocation near the endLocation and the startLocation near the pickUpLocation
    const sharingFilterDistance = sharings
      .filter(
        sharing =>
          distanceInKmBetweenEarthCoordinates(
            startLat,
            startLng,
            sharing.geometry.lat,
            sharing.geometry.lng
          ) < 30
      )
      .filter(sharing => {
        const { geometry } = sharing.rental.pickOffHub;
        return (
          // distance between pick-off location and pick-off hub location
          distanceInKmBetweenEarthCoordinates(
            endLat,
            endLng,
            geometry.lat,
            geometry.lng
          ) < 30
        );
      })
      .filter(item => item.rental.customer._id !== customerId);

    const total = await Sharing.countDocuments({ isActive: true });
    return res.status(HTTPStatus.OK).json({ sharingFilterDistance, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const getSharingByRentalId = async (req, res) => {
  try {
    const { id } = req.params;
    const sharing = await Sharing.find({ rental: id, isActive: true })
      .populate('rental customer sharingRequest')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      })
      .populate({
        path: 'sharingRequest',
        populate: { path: 'customer' },
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
    // id of sharing or rental?
    const { id } = req.params;
    const { sharingRequestId } = req.body;

    const sharing = await Sharing.findById(id);
    if (!sharing) {
      throw new Error('Can not find sharing');
    }

    const rental = await Rental.findById(sharing.rental);
    if (!rental) {
      throw new Error('Cannot find rental!');
    }

    const sharingRequest = await RentalSharingRequest.findOne({
      sharing: sharing._id,
      status: 'ACCEPTED',
    });

    if (!sharingRequest) {
      throw new Error('Cannot find sharing request');
    }
    if (sharingRequest._id !== sharingRequestId) {
      throw new Error('Sharing request id does not match!');
    }

    sharing.sharingRequest = sharingRequest;

    rental.status = 'SHARED';

    sharingRequest.status = 'CURRENT';

    await sharingRequest.save();
    await rental.save();
    await sharing.save();

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
