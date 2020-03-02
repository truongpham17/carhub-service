import { Router } from 'express';
import {
  getCar,
  createCar,
  updateCar,
  removeCar,
  getCarById,
} from './car.controller';

const routes = new Router();

routes.get('/', getCar);
routes.post('/', createCar);
routes.put('/:id', updateCar);
routes.delete('/:id', removeCar);
routes.get('/:id', getCarById);

export default routes;
