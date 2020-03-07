import { Router } from 'express';
import validate from 'express-validation';
import multer from 'multer';
import {
  getCarList,
  createCar,
  updateCar,
  removeCar,
  getCarById,
  checkCarByVin,
} from './car.controller';
import carValidations from './car.validations';

const upload = multer({ dest: 'uploads/' });

const routes = new Router();

routes.get('/', getCarList);
routes.get('/:id', getCarById);
routes.post('/', createCar);
routes.put('/:id', validate(carValidations.updateCar), updateCar);
routes.delete('/:id', removeCar);
routes.get('/checkVin/:vin', checkCarByVin);

export default routes;
