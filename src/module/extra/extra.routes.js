import { Router } from 'express';

import {
  getExtra,
  createExtra,
  updateExtra,
  removeExtra,
  getExtraById,
} from './extra.controller';

const routes = new Router();

routes.get('/', getExtra);
routes.post('/', createExtra);
routes.put('/:id', updateExtra);
routes.delete('/:id', removeExtra);
routes.get('/:id', getExtraById);

export default routes;
