import userRoutes from './user/user.routes';
import storeRoutes from './store/store.routes';
import billRoutes from './bill/bill.routes';
import reportRoutes from './report/report.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/store', storeRoutes);
  app.use('/bill', billRoutes);
  app.use('/report', reportRoutes);
};