import userRoutes from './user/user.routes';
import bookRoutes from './test/book.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/book', bookRoutes);
};
