import userRoutes from './user/user.routes';
import testRoutes from './test/test.routes';

export default app => {
  app.use('/test', testRoutes);
  app.use('/user', userRoutes);
};
