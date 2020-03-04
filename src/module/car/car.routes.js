import { Router } from 'express';
import validate from 'express-validation';
import {
  getCarList,
  createCar,
  updateCar,
  removeCar,
  getCarById,
} from './car.controller';
import carValidations from './car.validations';

const routes = new Router();

routes.get('/', getCarList);
routes.get('/:id', getCarById);
routes.post('/', validate(carValidations.createCar), createCar);
routes.put('/:id', validate(carValidations.updateCar), updateCar);
routes.delete('/:id', removeCar);

export default routes;
