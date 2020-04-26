import HTTPStatus from 'http-status';
import Rental from './rental.model';
import Log from '../log/log.model';
import Car from '../car/car.model';
import { sendNotification } from '../../utils/notification';
import Notification from '../notification/notification.model';
import RentalSharingRequest from '../rental-sharing-request/rentalSharingRequest.model';
import Sharing from '../sharing/sharing.model';
import Lease from '../lease/lease.model';
import { gateway } from '../../service/paypal';
import Transaction from '../transaction/transaction.model';
import {
  RENTAL_NOT_FOUND_CAR,
  RENTAL_NOT_FOUND_RENTAL,
  RENTAL_NOT_MATCH_CAR_MODEL,
  RENTAL_CAR_NOT_MATCH_ADDRESS,
  RENTAL_CAR_ALREADY_IN_USE,
  SHARING_RENTAL_NOT_FOUND,
  SHARING_RENTAL_NOT_SHARING,
} from '../../constant/errorCode';
import { LEASE_PRICE_PERCENTAGE } from '../../constant/policy';

export const getRental = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    let rentals;
    let total;
    console.log(req.user);
    switch (req.user.role) {
      case 'CUSTOMER':
        rentals = await Rental.find({ customer: req.customer._id })
          .skip(skip)
          .limit(limit)
          .sort({ updatedAt: -1 })
          .populate('car customer leaser pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments({ customer: req.customer._id });
        break;
      case 'EMPLOYEE':
        rentals = await Rental.find({
          pickupHub: req.employee.hub,
          status: 'UPCOMING',
        })
          .skip(skip)
          .limit(limit)
          .populate('car customer leaser pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments();
        break;
      case 'MANAGER':
        rentals = await Rental.find()
          .skip(skip)
          .limit(limit)
          .populate('car customer leaser pickupHub pickoffHub payment carModel')
          .populate({ path: 'car', populate: { path: 'carModel' } });
        total = await Rental.countDocuments();
        break;
      default:
        throw new Error('Role is not existed!');
    }
    return res.status(HTTPStatus.OK).json({ rentals, total });
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id)
      .populate('car customer leaser pickupHub pickoffHub payment carModel')
      .populate({ path: 'car', populate: { path: 'carModel' } });
    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addRental = async (req, res) => {
  try {
    const { nonce, ...rentalData } = req.body;
    console.log(rentalData);
    console.log(nonce);
    const rental = await Rental.create(rentalData);
    await Transaction.create({
      sender: req.customer._id,
      receiver: req.pickupHub,
      amount: 900,
      type: 'RENTAL',
    });
    // const saleRequest = {
    //   amount: '900.00',
    //   paymentMethodNonce: nonce,
    //   options: {
    //     submitForSettlement: true,
    //   },
    //   customerId: '"PDHMDYZCE43AU"',
    // };

    // const transaction = await gateway.transaction.sale(saleRequest);
    // console.log(transaction);
    await Log.create({
      type: 'CREATE',
      title: 'Create rental request',
      detail: rental._id,
    });
    return res.status(HTTPStatus.CREATED).json(rental.toJSON());
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, log } = req.body;

    const rental = await Rental.findById(id);
    Object.keys(data).forEach(key => {
      rental[key] = data[key];
    });
    await rental.save();

    if (log) {
      await Log.create({ detail: rental._id, ...log });
    }

    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const removeRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete({ _id: id });
    return res.status(HTTPStatus.OK).json({ msg: 'Deleted!!', rental });
  } catch (err) {
    return res.status(HTTPStatus.BAD_REQUEST).json(err);
  }
};

export const submitTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    // if (!req.employee) throw new Error('Permission denied!');

    const rental = await Rental.findById(id).populate('customer');

    if (!rental) {
      throw new Error(RENTAL_NOT_FOUND_RENTAL);
    }

    const { fcmToken } = rental.customer;
    if (!rental) {
      throw new Error('Rental not found');
    }

    // 'UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'
    const { status } = rental;
    const { toStatus, car } = req.body;

    let log = {};
    let carObj;
    let lease;
    let rentalDuplicate;
    switch (status) {
      case 'UPCOMING':
        if (toStatus !== 'CURRENT') {
          rental.numberDeclined = rental.numberDeclined
            ? rental.numberDeclined + 1
            : 1;
          await Log.create({
            type: 'CANCEL_TAKE_CAR',
            title: 'Not accept taking car',
            detail: rental._id,
          });
          await rental.save();
          return res.status(HTTPStatus.OK).json({});
        }
        rental.status = 'CURRENT';
        log = { type: 'RECEIVE', title: 'Take car at hub' };

        carObj = await Car.findById(car);
        if (!carObj) {
          throw new Error(RENTAL_NOT_FOUND_CAR);
        }

        if (carObj.carModel.toString() !== rental.carModel.toString()) {
          throw new Error(RENTAL_NOT_MATCH_CAR_MODEL);
        }

        rentalDuplicate = await Rental.findOne({
          car,
          status: { $in: ['CURRENT', 'SHARING', 'SHARED'] },
        });
        if (rentalDuplicate) {
          throw new Error(RENTAL_CAR_ALREADY_IN_USE);
        }

        rental.car = car;

        carObj = await Car.findById(car).populate('customer');

        carObj.currentHub = null;

        // Notification.create({
        //   customer: rental.customer._id,
        //   navigatorData: {
        //     screenName: 'RentHistoryItemDetailScreen',
        //     selectedId: rental._id,
        //   },
        //   detail: [
        //     {
        //       type: 'normal',
        //       value: 'Successfully take the ',
        //     },
        //     {
        //       type: 'bold',
        //       value: rental.car.carModel.name,
        //     },
        //     {
        //       type: 'normal',
        //       value: ` car.`,
        //     },
        //   ],
        // });

        lease = await Lease.findOne({
          car,
          status: 'AVAILABLE',
        }).populate('customer');
        // neu day la leasing car -> notify user
        if (lease) {
          sendNotification({
            title: 'Your car has been rent',
            body: `Congratulation! Your car has been rent by someone, you just earned $${rental.totalCost *
              LEASE_PRICE_PERCENTAGE}.`,
            fcmToken: carObj.customer.fcmToken,
            data: {
              screenName: 'LeaseHistoryItemDetailScreen',
              selectedId: lease._id.toString(),
              action: 'NAVIGATE',
            },
          });

          // Notification.create({
          //   customer: lease.customer._id,
          //   navigatorData: {
          //     screenName: 'LeaseHistoryItemDetailScreen',
          //     selectedId: lease._id,
          //   },
          //   detail: [
          //     {
          //       type: 'normal',
          //       value: 'Your car ',
          //     },
          //     {
          //       type: 'bold',
          //       value: rental.car.carModel.name,
          //     },
          //     {
          //       type: 'normal',
          //       value: ` has been rented. Your earn ${rental.totalCost *
          //         LEASE_PRICE_PERCENTAGE}`,
          //     },
          //   ],
          // });

          await Log.create({
            type: 'SOME_ONE_RENT_YOUR_CAR',
            title: 'Rented by someone',
            detail: lease._id,
            note: rental.totalCost * LEASE_PRICE_PERCENTAGE,
          });
          lease.totalEarn += rental.totalCost * LEASE_PRICE_PERCENTAGE;
          lease.status = 'HIRING';
        }

        break;
      case 'CURRENT':
        rental.status = toStatus;
        if (toStatus === 'SHARING') {
          log = { type: 'CREATE_SHARING', title: 'Request sharing car' };
        }
        if (toStatus === 'PAST') {
          carObj = await Car.findById(rental.car);
          carObj.currentHub = rental.pickoffHub;

          log = { type: 'RETURN', title: 'Return car' };
        }

        lease = await Lease.findOne({ car: rental.car, status: 'SHARING' });
        if (lease) {
          lease.status = 'AVAILABEL';
        }

        break;
      case 'OVERDUE':
        rental.status = 'PAST';
        log = { type: 'RETURN', title: 'Return car' };

        lease = await Lease.findOne({ car: rental.car, status: 'SHARING' });
        if (lease) {
          lease.status = 'AVAILABEL';
        }

        break;
      case 'SHARING':
        rental.status = toStatus;

        if (toStatus === 'SHARED') {
          sendNotification({
            title: 'Sharing request',
            body: 'Success transfer car',
            fcmToken,
            data: {
              action: 'NAVIGATE',
              screenName: 'RentHistoryItemDetailScreen',
              screenProps: {
                selectedId: rental._id.toString(),
              },
            },
          });

          Notification.create({
            customer: lease.car.customer._id,
            navigatorData: {
              screenName: 'RentHistoryItemDetailScreen',
              selectedId: lease._id,
            },
            detail: [
              {
                type: 'normal',
                value: 'Success transfer your rental car',
              },
            ],
          });

          log = { type: 'CONFIRM_SHARING', title: 'Confirm sharing car' };
        }
        if (toStatus === 'CURRENT') {
          log = { type: 'CANCEL_SHARING', title: 'Cancel sharing car' };
        }
        break;
      default:
        break;
    }
    if (lease) {
      await lease.save();
    }
    if (carObj) {
      await carObj.save();
    }
    await rental.save();
    if (log) {
      await Log.create({ detail: rental._id, ...log });
    }

    return res.status(HTTPStatus.OK).json(rental);
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

export const cancelSharing = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    if (!rental) {
      throw new Error(SHARING_RENTAL_NOT_FOUND);
    }

    if (rental.status !== 'SHARING') {
      throw new Error(SHARING_RENTAL_NOT_SHARING);
    }

    rental.status = 'CURRENT';

    const sharings = await Sharing.find({
      rental: rental._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!Array.isArray(sharings) || sharings.length === 0) {
      throw new Error(SHARING_RENTAL_NOT_SHARING);
    }
    const lastestSharing = sharings[0];

    // remove lastest sharing
    lastestSharing.isActive = false;

    const sharingRequests = await RentalSharingRequest.find({
      sharing: lastestSharing._id,
      status: { $in: ['PENDING', 'ACCEPTED'] },
      isActive: true,
    }).populate('customer');

    // notify all user
    if (Array.isArray(sharingRequests) && sharingRequests.length > 0) {
      sharingRequests.forEach(async request => {
        sendNotification({
          fcmToken: request.customer.fcmToken,
          title: 'The sharing car is not available',
          body:
            "The owner's car of your request has cancelled the sharing. Please try to hire another car",
        });
        request.isActive = false;
        await request.save();
      });
    }

    await Log.create({
      type: 'CANCEL_SHARING',
      title: 'Cancel sharing car',
      detail: id,
    });
    await rental.save();
    await lastestSharing.save();
    return res.status(HTTPStatus.OK).json({});
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};
