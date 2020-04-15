import HTTPStatus from 'http-status';
import Sharing from './sharing.model';
import RentalSharingRequest from '../rental-sharing-request/rentalSharingRequest.model';
import Rental from '../rental/rental.model';
import { distanceInKmBetweenEarthCoordinates } from '../../utils/distance';
import { SHARING_RENTAL_NOT_FOUND } from '../../constant/errorCode';
import Log from '../log/log.model';

export const getSharing = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const sharings = await Sharing.find({})
      .skip(skip)
      .limit(limit);
    const total = await Sharing.countDocuments({});
    return res.status(HTTPStatus.OK).json({ sharings, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const suggestSharing = async (req, res) => {
  try {
    const { _id: customer } = req.customer;
    if (!customer) {
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
      fromDate: { $lte: startDate },
      toDate: { $gte: endDate },
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

    // only show result if the startLocation near the pickup location, endLocation near return hub
    const sharingFilterDistance = sharings
      .filter(
        sharing =>
          // check start location and pickup location
          distanceInKmBetweenEarthCoordinates(
            startLat,
            startLng,
            sharing.geometry.lat,
            sharing.geometry.lng
          ) < 30
      )

      .filter(sharing => {
        const { geometry } = sharing.rental.pickoffHub;
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
      .filter(item => item.rental.customer._id !== customer)
      .map(sharing => ({
        ...sharing.toJSON(),
        distance: distanceInKmBetweenEarthCoordinates(
          startLat,
          startLng,
          sharing.geometry.lat,
          sharing.geometry.lng
        ),
      }));

    return res.status(HTTPStatus.OK).json(sharingFilterDistance);
  } catch (error) {
    console.log(error);
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
    const sharings = await Sharing.find({ rental: id, isActive: true })
      .sort({
        createdAt: -1,
      })
      .populate('rental customer')
      .populate({
        path: 'rental',
        populate: { path: 'carModel customer pickoffHub' },
      });
    if (!Array.isArray(sharings) || sharings.length === 0) {
      return res.status(HTTPStatus.NO_CONTENT).json({});
    }
    return res.status(HTTPStatus.OK).json(sharings[0]);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const confirmSharing = async (req, res) => {
  try {
    // id of rental
    const { id } = req.params;
    const { sharingRequestId } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
      throw new Error('Cannot find rental!');
    }

    const sharings = await Sharing.find({ rental: id, isActive: true }).sort({
      createdAt: -1,
    });

    if (!Array.isArray(sharings) || sharings.length === 0) {
      throw new Error('Can not find sharing');
    }

    const sharing = sharings[0];

    const sharingRequest = await RentalSharingRequest.findOne({
      sharing: sharing._id,
      status: 'ACCEPTED',
    });

    if (!sharingRequest) {
      throw new Error('Cannot find sharing request');
    }

    if (sharingRequest._id.toString() !== sharingRequestId) {
      throw new Error('Sharing request id does not match!');
    }

    sharing.sharingRequest = sharingRequest;
    sharing.customer = sharingRequest.customer;
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

export const createSharingFromRental = async (req, res) => {
  try {
    const { rental, price, fromDate, toDate } = req.body;
    const rentalObj = await Rental.findById(rental);

    if (!rentalObj) {
      throw new Error(SHARING_RENTAL_NOT_FOUND);
    }

    rentalObj.status = 'SHARING';

    const sharing = await Sharing.create(req.body);

    await Log.create({
      type: 'CREATE_SHARING',
      title: 'Request sharing car',
      detail: rental,
      note: `${price}-${fromDate}-${toDate}`,
    });

    await rentalObj.save();
    return res.status(HTTPStatus.CREATED).json(sharing.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
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
