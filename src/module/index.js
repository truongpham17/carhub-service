import userRoutes from './user/user.routes';
import testRoutes from './test/test.routes';
import extraRoutes from './extra/extra.routes';
import paymentRoutes from './payment/payment.routes';
import rentalRoutes from './rental/rental.routes';

export default app => {
  app.use('/test', testRoutes);
  app.use('/user', userRoutes);
  app.use('/extra', extraRoutes);
  app.use('/payment', paymentRoutes);
  app.use('/rental', rentalRoutes);
};
