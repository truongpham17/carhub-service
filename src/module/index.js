import userRoutes from './user/user.routes';
import bookRoutes from './test/book.routes';
import carRoutes from './car/car.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/book', bookRoutes);
  app.use('/car', carRoutes);
};
