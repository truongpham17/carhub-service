import { Router } from 'express';

import {
  getHub,
  createHub,
  updateHub,
  removeHub,
  getHubById,
} from './hub.controller';

const routes = new Router();

routes.get('/', getHub);
routes.post('/', createHub);
routes.put('/:id', updateHub);
routes.delete('/:id', removeHub);
routes.get('/:id', getHubById);

export default routes;
