import { Router } from 'express';
import {
  addRental,
  getRental,
  getRentalById,
  removeRental,
  updateRental,
} from './rental.controller';

const routes = new Router();

routes.get('/', getRental);
routes.get('/:id', getRentalById);
routes.post('/', addRental);
routes.put('/:id', updateRental);
routes.delete('/:id', removeRental);

export default routes;
