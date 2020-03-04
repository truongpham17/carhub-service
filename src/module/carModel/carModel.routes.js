import { Router } from 'express';
import validate from 'express-validation';
import {
  getCarModelList,
  createCarModel,
  updateCarModel,
  removeCarModel,
  getCarModelById,
} from './carModel.controller';
import carValidations from '../car/car.validations';

const routes = new Router();

routes.get('/', getCarModelList);
routes.post('/', validate(carValidations.createCar), createCarModel);
routes.put('/:id', validate(carValidations.updateCar), updateCarModel);
routes.delete('/:id', removeCarModel);
routes.get('/:id', getCarModelById);

export default routes;
