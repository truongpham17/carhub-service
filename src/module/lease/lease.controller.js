import HTTPStatus from 'http-status';
import moment from 'moment';
import Lease from './lease.model';
import Transaction from '../transaction/transaction.model';
import Log from '../log/log.model';
import Car from '../car/car.model';
import { sendNotification } from '../../utils/notification';

export const getLeaseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    let leases;
    let total;
    switch (req.user.role) {
      case 'CUSTOMER':
        leases = await Lease.find({ customer: req.customer._id })
          .skip(skip)
          .limit(limit)
          .populate('car hub')
          .populate({ path: 'car', populate: { path: 'carModel customer' } });
        total = await Lease.countDocuments({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
        leases = await Lease.find({ hub: req.employee.hub })
          .skip(skip)
          .limit(limit)
          .populate('car hub')
          .populate({ path: 'car', populate: { path: 'carModel customer' } });
        total = await Lease.count({ hub: req.employee.hub });
        break;
      case 'MANAGER':
        leases = await Lease.find()
          .skip(skip)
          .limit(limit)
          .populate('car hub')
          .populate({ path: 'car', populate: { path: 'carModel customer' } });
        total = await Lease.count();
        break;
      default:
        throw new Error('Role is not existed!');
    }
    return res.status(HTTPStatus.OK).json({ leases, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getLease = async (req, res) => {
  try {
    const { id } = req.params;
    const lease = await Lease.findById(id)
      .populate('car hub')
      .populate({ path: 'car', populate: { path: 'carModel customer' } });
    if (!lease) {
      throw new Error('Lease Not found');
    }
    return res.status(HTTPStatus.OK).json(lease.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addLease = async (req, res) => {
  try {
    const lease = await Lease.create(req.body);

    await Log.create({
      type: 'CREATE',
      title: 'Create lease request',
      detail: lease._id,
    });

    return res.status(HTTPStatus.CREATED).json(lease);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateLease = async (req, res) => {
  try {
    const { data, log } = req.body;
    const lease = await Lease.findById(req.params.id);
    Object.keys(data).forEach(key => {
      lease[key] = data[key];
    });
    await lease.save();

    await Log.create({ detail: lease._id, ...log });

    return res.status(HTTPStatus.OK).json(lease);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

/*

    'PENDING',
        'UPCOMING',
        'DECLINE',
        'AVAILABLE',
        'HIRING',
        'WAIT_TO_RETURN',
        'PAST', */

export const submitTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { toStatus } = req.body;
    let log = {};
    let notificationData = {};
    const lease = await Lease.findById(id)
      .populate({
        path: 'car hub',
      })
      .populate({ path: 'car', populate: { path: 'customer' } });

    if (!lease || !lease.isActive) {
      throw new Error('lease not found');
    }

    const { fcmToken } = lease.car.customer;

    // 'PENDING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'
    const { status } = lease;
    switch (status) {
      case 'PENDING':
        lease.status = toStatus;

        if (toStatus === 'ACCEPTED') {
          log = {
            type: 'ACCEPTED',
            title: 'Request accepted by hub',
          };
          notificationData = {
            title: 'Your lease request has been accepted',
            body: `Thank you for using our service, please drive your car to ${
              lease.hub.address
            } at ${moment(lease.startDate).format('MMM DD YYYY')}.`,
          };
        } else {
          log = {
            type: 'DECLINE',
            title: 'Request decline by hub',
          };
          notificationData = {
            title: 'Your lease request has been declined',
            body:
              'Sorry, but for some reason, your lease request has been declined. Click here to see more information',
          };
        }

        sendNotification({
          ...notificationData,
          data: {
            action: 'NAVIGATE',
            screenName: 'RentHistoryItemDetailScreen',
          },
          fcmToken,
        });
        break;
      case 'AVAILABLE':
      case 'WAIT_TO_RETURN':
        lease.status = toStatus;

        if (toStatus === 'PAST') {
          log = {
            type: 'TAKE_BACK',
            title: 'Take car at hub',
          };
        }
        if (toStatus === 'HIRING') {
          log = {
            type: 'SOME_ONE_RENT_YOUR_CAR',
            title: 'Rented by someone',
          };
          sendNotification({
            title: 'Your car has been rented',
            body:
              'Congratulation! Some one has rented your car. Click here to see how much you earn',
            fcmToken,
            data: {
              action: 'NAVIGATE',
              screenName: 'RentHistoryItemDetailScreen',
              screenProps: {
                selectedId: lease._id,
              },
            },
          });
        }

        break;
      case 'ACCEPTED':
        lease.status = 'AVAILABLE';
        log = {
          type: 'PLACING',
          title: 'Placing car at hub',
        };
        sendNotification({
          title: 'Placing car successfully',
          body:
            'You have placed your car at the hub. Thank you for using our service',
          fcmToken,
        });
        break;
      default:
        break;
    }
    await lease.save();

    if (log) {
      await Log.create({ detail: lease._id, ...log });
    }

    return res.status(HTTPStatus.OK).json(lease);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};
