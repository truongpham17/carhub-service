import userRoutes from './user/user.routes';
import bookRoutes from './test/book.routes';
import cardRoutes from './card/card.routes';
import licenseRoutes from './license/license.routes';
import leaseRoutes from './lease/lease.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/book', bookRoutes);
  app.use('/card', cardRoutes);
  app.use('/license', licenseRoutes);
  app.use('/lease', leaseRoutes);
};
