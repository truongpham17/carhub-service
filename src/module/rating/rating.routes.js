import { Router } from 'express';
import {
  getRating,
  getRatingById,
  createRating,
  updateRating,
  removeRating,
} from './rating.controller';

const routes = new Router();

routes.get('/', getRating);
routes.get('/:id', getRatingById);
routes.post('/', createRating);
routes.put('/:id', updateRating);
routes.delete('/:id', removeRating);

export default routes;
