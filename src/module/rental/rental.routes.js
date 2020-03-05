import { Router } from 'express';
import validate from 'express-validation';
import {
  addRental,
  getRental,
  getRentalById,
  removeRental,
  updateRental,
} from './rental.controller';
import { auth } from '../../service/passport';
import Validations from './rental.validations';

const routes = new Router();

routes.get('/', auth, getRental);
routes.get('/:id', auth, getRentalById);
routes.post('/', auth, validate(Validations.addRental), addRental);
routes.put('/:id', auth, validate(Validations.updateRental), updateRental);
routes.delete('/:id', auth, removeRental);

export default routes;