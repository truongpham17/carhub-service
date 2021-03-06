import schedule from 'node-schedule';
import moment from 'moment';
import Rental from './rental.model';
import Sharing from '../sharing/sharing.model';
import { sendNotification } from '../../utils/notification';

// finding overdue renting period
schedule.scheduleJob('0 0 10 * * *', async function() {
  const overdueRentals = await Rental.find({
    isActive: true,
    status: 'CURRENT',
    endDate: {
      $gte: new Date(Date.now() - 86400000),
    },
  }).populate('customer');
  if (overdueRentals && overdueRentals.length > 0) {
    overdueRentals.forEach(async rental => {
      sendNotification({
        title: 'Your rental period is overdue',
        body:
          'Your rental period is overdue. Please drive your car to hub. We are counting lating day as penalty fee',
        data: {},
        fcmToken: rental.customer.fcmToken,
      });
      rental.status = 'CANCEL';
      await rental.save();
    });
  }
});

// finding overdue rent request
schedule.scheduleJob('0 0 10 * * *', async function() {
  const overdueRentals = await Rental.find({
    isActive: true,
    status: 'UPCOMING',
    startDate: {
      $gte: new Date(Date.now() - 86400000),
    },
  }).populate('customer');
  if (overdueRentals && overdueRentals.length > 0) {
    overdueRentals.forEach(async rental => {
      sendNotification({
        title: 'Your rental booking is going to overdue',
        body:
          'Your rental booking is going to overdue. Please come to hub a get car!',
        data: {},
        fcmToken: rental.customer.fcmToken,
      });
      rental.status = 'OVERDUE';
      await rental.save();
    });
  }
});

// finding overdue rent request and cancel request
schedule.scheduleJob('0 0 17 * * *', async function() {
  const overdueRentals = await Rental.find({
    isActive: true,
    status: 'UPCOMING',
    startDate: {
      $gte: new Date(Date.now() - 86400000),
    },
  }).populate('customer');
  if (overdueRentals && overdueRentals.length > 0) {
    overdueRentals.forEach(async rental => {
      sendNotification({
        title: 'Your rental booking is overdue',
        body:
          'Your rental booking is overdue. We will cancel your booking. Thanks for using our service!',
        data: {},
        fcmToken: rental.customer.fcmToken,
      });
      rental.status = 'CANCEL';
      await rental.save();
    });
  }
});

// finding over sharing (rental time < 3 days)

schedule.scheduleJob('0 0 17 * * *', async function() {
  const overdueSharings = await Rental.find({
    isActive: true,
    status: 'SHARING',
  });
  overdueSharings.forEach(async rental => {
    if (moment(rental.endDate).subtract(rental.startDate, 'days') < 3) {
      rental.status = 'CURRENT';
      const sharing = await Sharing.findOne({
        rental: rental._id,
        isActive: true,
      });
      sharing.isActive = false;
      await sharing.save();
      await rental.save();
      sendNotification({
        title: 'Your sharing is overdue',
        body:
          'Your sharing is overdue due to renting period less than 3 day. Thanks for using our service',
        data: {},
        fcmToken: rental.customer.fcmToken,
      });
    }
  });
});
