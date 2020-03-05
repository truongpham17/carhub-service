import { Router } from 'express';
import validate from 'express-validation';
import Validations from './rating.validations';
import {
  getRatingList,
  getRatingById,
  createRating,
  updateRating,
  removeRating,
} from './rating.controller';

const routes = new Router();

routes.get('/', getRatingList);
routes.get('/:id', getRatingById);
routes.post('/', validate(Validations.createRating), createRating);
routes.put('/:id', validate(Validations.updateRating), updateRating);
routes.delete('/:id', removeRating);

export default routes;
