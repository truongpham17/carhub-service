import HTTPStatus from 'http-status';
import RentalSharingRequest from './rentalSharingRequest.model';
import Sharing from '../sharing/sharing.model';
import { sendNotification } from '../../utils/notification';

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

export const getRentalSharingByCustomer = async (req, res) => {
  try {
    if (!req.customer) {
      throw new Error('Not user!');
    }
    const requestList = await RentalSharingRequest.find({
      isActive: true,
      customer: req.customer._id,
      status: { $in: ['ACCEPTED', 'PENDING', 'CURRENT'] },
    })
      .populate('customer sharing')
      .populate({ path: 'sharing', populate: { path: 'rental' } })
      .populate({
        path: 'sharing',
        populate: {
          path: 'rental',
          populate: { path: 'carModel customer car' },
        },
      });
    return res.status(HTTPStatus.OK).json(requestList);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const getRentalRequestBySharing = async (req, res) => {
  try {
    const { id } = req.params;
    const requestList = await RentalSharingRequest.find({
      sharing: id,
      isActive: true,
    }).populate('customer');
    return res.status(HTTPStatus.OK).json(requestList);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const addRentalSharingRequest = async (req, res) => {
  try {
    const { sharing } = req.body;
    const sharingObj = await Sharing.findById(sharing)
      .populate('rental')
      .populate({ path: 'rental', populate: { path: 'customer' } });
    console.log('sharing: ', sharingObj);
    if (!sharingObj) {
      throw new Error('Cannot find sharing');
    }
    if (sharingObj.customer) {
      throw new Error('This sharing already transfer');
    }

    const rentalRequest = await RentalSharingRequest.create(req.body);

    sendNotification({
      fcmToken: sharingObj.rental.customer.fcmToken,
      title: 'Some one want to hire your car',
      body: 'Click here to see detail request, and accept transfer your car',
      data: {
        action: 'NAGIGATE',
        screenName: 'RentSharingRequestScreen',
        // screenProps: {
        selectedId: sharingObj.rental._id.toString(),
        // },
      },
    });

    return res.status(HTTPStatus.OK).json(rentalRequest);
  } catch (error) {
    console.log(error);
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

export const declineRentalSharingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const rentalSharingRequest = await RentalSharingRequest.findById(
      id
    ).populate('customer');
    if (!rentalSharingRequest) {
      throw new Error('Can not find rental sharing request');
    }
    rentalSharingRequest.status = 'DECLINED';
    sendNotification({
      title: 'Your request has been declined',
      fcmToken: rentalSharingRequest.customer.fcmToken,
      data: {
        screenName: 'HistoryStack',
        action: 'NAVIGATE',
      },
    });

    await rentalSharingRequest.save();
    return res.status(HTTPStatus.OK).json(rentalSharingRequest.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const acceptRentalSharingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // const { acceptedId } = req.body;
    const acceptedRentalSharing = await RentalSharingRequest.findById(
      id
    ).populate('customer sharing');

    if (!acceptedRentalSharing) {
      throw new Error('Can not find rental sharing request');
    }

    const { sharing } = acceptedRentalSharing;
    if (!sharing) {
      throw new Error('Cannot find sharing!');
    }

    const rentalSharingRequests =
      (await RentalSharingRequest.find({ sharing: sharing._id }).populate(
        'customer'
      )) || [];

    for (let i = 0; i < rentalSharingRequests.length; i++) {
      const rentalSharing = rentalSharingRequests[i];
      if (rentalSharing._id === id) {
        rentalSharing.status = 'ACCEPTED';
        await rentalSharing.save();
        sendNotification({
          title: 'Your request has been accepted',
          body: `Remember to come to ${
            sharing.address
          } to take your rental car`,
          fcmToken: rentalSharing.customer.fcmToken,
          data: {
            screenName: 'HistoryStack',
            action: 'NAVIGATE',
          },
        });
      } else {
        sendNotification({
          title: 'Your request has been declined',
          fcmToken: rentalSharing.customer.fcmToken,
          data: {
            screenName: 'HistoryStack',
            action: 'NAVIGATE',
          },
        });
        rentalSharing.status = 'DECLINED';
        await rentalSharing.save();
      }
    }
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};
