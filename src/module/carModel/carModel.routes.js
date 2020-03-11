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
} from './carModel.controller';
import carValidations from './carModel.validations';

const routes = new Router();

routes.get('/', auth, getCarModelList);
routes.get('/:id', auth, getCarModelById);
routes.get('/getCarByVin/:vin', getCarModelByVin);

routes.post('/', auth, validate(carValidations.createCarModel), createCarModel);
routes.post('/search', searchNearByCarModel);

routes.put(
  '/:id',
  auth,
  validate(carValidations.updateCarModel),
  updateCarModel
);
routes.delete('/:id', auth, removeCarModel);
export default routes;
