import { Router } from 'express';
import {
  getPayment,
  createPayment,
  getPaymentById,
  updatePayment,
  removePayment,
} from './payment.controller';

const routes = new Router();

routes.get('/', getPayment);
routes.post('/', createPayment);
routes.get('/:id', getPaymentById);
routes.put('/:id', updatePayment);
routes.delete('/:id', removePayment);

export default routes;
