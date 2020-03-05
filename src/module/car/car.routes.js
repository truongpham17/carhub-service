import { Router } from 'express';
import validate from 'express-validation';
import { auth } from '../../service/passport';
import {
  getCarList,
  createCar,
  updateCar,
  removeCar,
  getCarById,
  checkCarByVin,
} from './car.controller';
import carValidations from './car.validations';

const routes = new Router();

<<<<<<< HEAD
routes.get('/', auth, getCarList);
routes.get('/:id', auth, getCarById);
routes.post('/', auth, validate(carValidations.createCar), createCar);
routes.put('/:id', auth, validate(carValidations.updateCar), updateCar);
routes.delete('/:id', auth, removeCar);
=======
routes.get('/', getCarList);
routes.get('/:id', getCarById);
routes.post('/', validate(carValidations.createCar), createCar);
routes.put('/:id', validate(carValidations.updateCar), updateCar);
routes.delete('/:id', removeCar);
routes.get('/checkVin/:vin', checkCarByVin);
>>>>>>> origin/Cuong_V1

export default routes;
