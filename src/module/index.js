import bookRoutes from './test/book.routes';
import carModelRoutes from './carModel/carModel.routes';
import carRoutes from './car/car.routes';
import hubRoutes from './hub/hub.routes';
import ratingRoutes from './rating/rating.routes';
import accountRoutes from './account/account.routes';
import customerRoutes from './customer/customer.routes';
import employeeRoutes from './employee/employee.routes';
import licenseRoutes from './license/license.routes';
import managerRoutes from './manager/manager.routes';
import userRoutes from './user/user.routes';
import extraRoutes from './extra/extra.routes';
import paymentRoutes from './payment/payment.routes';
import rentalRoutes from './rental/rental.routes';
import leaseRoutes from './lease/lease.routes';
import notificationRoutes from './notification/notification.routes';
import sharingRoutes from './sharing/sharing.routes';
import transactionRoutes from './transaction/transaction.routes';
import logRoutes from './log/log.routes';
import transferRoutes from './transfer/transfer.routes';
import rentalSharingRequest from './rental-sharing-request/rentalSharingRequest.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/carModel', carModelRoutes);
  app.use('/car', carRoutes);
  app.use('/hub', hubRoutes);
  app.use('/rating', ratingRoutes);
  app.use('/extra', extraRoutes);
  app.use('/payment', paymentRoutes);
  app.use('/rental', rentalRoutes);
  app.use('/account', accountRoutes);
  app.use('/customer', customerRoutes);
  app.use('/employee', employeeRoutes);
  app.use('/manager', managerRoutes);
  app.use('/lease', leaseRoutes);
  app.use('/license', licenseRoutes);
  app.use('/sharing', sharingRoutes);
  app.use('/transaction', transactionRoutes);
  app.use('/log', logRoutes);
  app.use('/transfer', transferRoutes);
  app.use('/rentalSharingRequest', rentalSharingRequest);
  app.use('/notification', notificationRoutes);
};
