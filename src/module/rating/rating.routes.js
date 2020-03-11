import { Router } from 'express';
import validate from 'express-validation';
import Validations from './rating.validations';

import { auth } from '../../service/passport';
import {
  getRatingList,
  getRatingById,
  createRating,
  updateRating,
  removeRating,
} from './rating.controller';

const routes = new Router();

routes.get('/', auth, getRatingList);
routes.get('/:id', auth, getRatingById);
routes.post('/', auth, validate(Validations.createRating), createRating);
routes.put('/:id', auth, validate(Validations.updateRating), updateRating);
routes.delete('/:id', auth, removeRating);

export default routes;
