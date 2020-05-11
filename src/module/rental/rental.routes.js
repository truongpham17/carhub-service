import { Router } from 'express';
import validate from 'express-validation';
import {
  addRental,
  getRental,
  getRentalById,
  removeRental,
  updateRental,
  submitTransaction,
  cancelSharing,
} from './rental.controller';
import { auth } from '../../service/passport';
import Validations from './rental.validations';
import './rental.scheduler';

const routes = new Router();

routes.get('/', auth, getRental);
routes.get('/:id', auth, getRentalById);
routes.post('/', auth, validate(Validations.addRental), addRental);

routes.put('/:id', auth, updateRental);
routes.patch('/transaction/:id', auth, submitTransaction);
routes.patch('/:id', auth, updateRental);
routes.patch('/cancelSharing/:id', auth, cancelSharing);

routes.delete('/:id', auth, removeRental);

export default routes;
