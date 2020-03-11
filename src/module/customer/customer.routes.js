import validate from 'express-validation';
import { Router } from 'express';
import {
  getCustomerList,
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerByAccount,
} from './customer.controllers';
import Validations from './customer.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getCustomerList);
routes.get('/:id', auth, getCustomer);
routes.post('/', auth, validate(Validations.createCustomer), createCustomer);
routes.patch(
  '/:id',
  auth,
  validate(Validations.updateCustomer),
  updateCustomer
);
routes.get('/account/:id', getCustomerByAccount);

export default routes;
