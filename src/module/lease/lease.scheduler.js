import schedule from 'node-schedule';
import Lease from './lease.model';
import { sendNotification } from '../../utils/notification';

schedule.scheduleJob('0 0 17 * * *', async function() {
  console.log(1);
  const overdueLeases = await Lease.find({
    isActive: true,
    status: 'ACCEPTED',
    startDate: {
      $gte: new Date(Date.now() - 86400000),
      // $lte: new Date(),
    },
  }).populate('customer');
  if (overdueLeases && overdueLeases.length > 0) {
    overdueLeases.forEach(async lease => {
      sendNotification({
        title: 'Your leasing is overdue',
        body:
          'Your leasing is overdue, so we cancel your request. Thanks for using our service',
        data: {},
        fcmToken: lease.customer.fcmToken,
      });
      lease.status = 'CANCEL';
      await lease.save();
    });
  }
});
