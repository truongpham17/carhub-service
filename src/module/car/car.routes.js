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
  getCarsByHub,
  getCarsByCustomer,
  getCustomerPreviousCarList,
  createCarAfterCheckingVin,
} from './car.controller';
import carValidations from './car.validations';

const routes = new Router();

routes.get('/', auth, getCarList);
routes.get('/list', auth, getCustomerPreviousCarList);
routes.get('/:id', auth, getCarById);
routes.get('/hub/:id', auth, getCarsByHub);
routes.get('/customer/:id', auth, getCarsByCustomer);
routes.post('/createCarAfterChecking', auth, createCarAfterCheckingVin);
// routes.post('/', auth, validate(carValidations.createCar), createCar);
routes.post('/', auth, createCar);
routes.put('/:id', auth, validate(carValidations.updateCar), updateCar);
routes.delete('/:id', auth, removeCar);
routes.get('/checkVin/:vin', checkCarByVin);

export default routes;
