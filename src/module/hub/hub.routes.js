import { Router } from 'express';
import validate from 'express-validation';
import hubValidations from './hub.validations';

import {
  getHubList,
  createHub,
  updateHub,
  removeHub,
  getHubById,
} from './hub.controller';

const routes = new Router();

routes.get('/', getHubList);
routes.post('/', validate(hubValidations.createHub), createHub);
routes.put('/:id', validate(hubValidations.updateHub), updateHub);
routes.delete('/:id', removeHub);
routes.get('/:id', getHubById);

export default routes;
