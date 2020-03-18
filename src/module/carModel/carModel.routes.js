import { Router } from 'express';
import validate from 'express-validation';

import { auth } from '../../service/passport';
import {
  getCarModelList,
  createCarModel,
  updateCarModel,
  removeCarModel,
  getCarModelById,
  getCarModelByVin,
  searchNearByCarModel,
  transferCarModel,
  createCarModelBySendingLease,
  findCarModelByName,
} from './carModel.controller';
import carValidations from './carModel.validations';

const routes = new Router();

routes.get('/', auth, getCarModelList);
routes.get('/:id', auth, getCarModelById);
routes.post('/findByName', auth, findCarModelByName);
routes.post('/createCarModel', auth, createCarModelBySendingLease);
routes.get('/getCarByVin/:vin', getCarModelByVin);

// routes.post('/', auth, validate(carValidations.createCarModel), createCarModel);
routes.post('/', auth, createCarModel);
routes.post('/search', searchNearByCarModel);

routes.put('/transfer', auth, transferCarModel);

routes.put(
  '/:id',
  auth,
  validate(carValidations.updateCarModel),
  updateCarModel
);
routes.get('/:id', auth, getCarModelById);
routes.get('/getCarByVin/:vin', getCarModelByVin);
routes.get('/', getCarModelList);
routes.post('/', validate(carValidations.createCarModel), createCarModel);
routes.put('/:id', validate(carValidations.updateCarModel), updateCarModel);
routes.delete('/:id', removeCarModel);

export default routes;
