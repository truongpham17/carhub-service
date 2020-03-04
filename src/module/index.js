import userRoutes from './user/user.routes';
import bookRoutes from './test/book.routes';
import carModelRoutes from './carModel/carModel.routes';
import carRoutes from './car/car.routes';
import hubRoutes from './hub/hub.routes';
import ratingRoutes from './rating/rating.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/book', bookRoutes);
  app.use('/carModel', carModelRoutes);
  app.use('/car', carRoutes);
  app.use('/hub', hubRoutes);
  app.use('/rating', ratingRoutes);
};
