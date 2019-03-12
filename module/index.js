import userRoutes from './user/user.routes';
import storeRoutes from './store/store.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/store', storeRoutes);
};
