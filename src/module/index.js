import userRoutes from './user/user.routes';
import bookRoutes from './test/book.routes';
import carRoutes from './car/car.routes';
import carmappingRoutes from './carmapping/carmapping.routes';
import hubRoutes from './hub/hub.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/book', bookRoutes);
  app.use('/car', carRoutes);
  app.use('/carmapping', carmappingRoutes);
  app.use('/hub', hubRoutes);
};
