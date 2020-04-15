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
  // getCustomerCarList,
  transferLeasingCar,
  getCustomerPreviousCarList,
  createLeasingCar,
  getHubCarList,
  checkAvailableCarForRental,
} from './car.controller';
import carValidations from './car.validations';

const routes = new Router();

routes.get('/', auth, getCarList);
routes.get('/list', auth, getCustomerPreviousCarList);
routes.get('/hubCarList', auth, getHubCarList);
routes.get('/:id', auth, getCarById);
routes.get('/hub/:id', auth, getCarsByHub);
routes.get('/customer/:id', auth, getCarsByCustomer);
routes.get('/checkVin/:vin', checkCarByVin);
routes.get(
  '/checkAvailableCar/:id/:rentalId',
  auth,
  checkAvailableCarForRental
);
// routes.post('/', auth, validate(carValidations.createCar), createCar);
routes.post('/', auth, createCar);
routes.post('/createLeasingCar', auth, createLeasingCar);
routes.put('/transfer', auth, transferLeasingCar);

routes.put('/:id', auth, validate(carValidations.updateCar), updateCar);
routes.delete('/:id', auth, removeCar);

export default routes;
