import { Router } from 'express';
import validate from 'express-validation';
import hubValidations from './hub.validations';

import { auth } from '../../service/passport';
import {
  getHubList,
  createHub,
  updateHub,
  removeHub,
  getHubById,
} from './hub.controller';

const routes = new Router();

routes.get('/', auth, getHubList);
routes.post('/', auth, validate(hubValidations.createHub), createHub);

routes.put('/:id', auth, validate(hubValidations.updateHub), updateHub);
routes.delete('/:id', auth, removeHub);
routes.get('/:id', auth, getHubById);

export default routes;
