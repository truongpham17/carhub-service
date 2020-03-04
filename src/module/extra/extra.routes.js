import { Router } from 'express';
import validate from 'express-validation';
import { auth } from '../../service/passport';
import Validations from './extra.validations';

import {
  getExtra,
  createExtra,
  updateExtra,
  removeExtra,
  getExtraById,
} from './extra.controller';

const routes = new Router();

routes.get('/', getExtra);
routes.post('/', auth, validate(Validations.addExtra), createExtra);
routes.put('/:id', auth, validate(Validations.updateExtra), updateExtra);
routes.delete('/:id', auth, removeExtra);
routes.get('/:id', getExtraById);

export default routes;
