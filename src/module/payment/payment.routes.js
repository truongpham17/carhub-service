import { Router } from 'express';
import validate from 'express-validation';
import {
  getPayment,
  createPayment,
  getPaymentById,
  updatePayment,
  removePayment,
} from './payment.controller';
import Validations from './payment.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getPayment);
routes.post('/', auth, validate(Validations.addPayment), createPayment);
routes.get('/:id', auth, getPaymentById);
routes.put('/:id', auth, validate(Validations.updatePayment), updatePayment);
routes.delete('/:id', auth, removePayment);

export default routes;
