import validate from 'express-validation';
import { Router } from 'express';
import {
  getCustomerList,
  getCustomer,
  deleteCustomer,
  addCustomerDebt,
} from './customer.controllers';
import Validations from './customer.validations';
import { authLocal, authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, getCustomerList);
routes.get('/:id', authJwt, getCustomer);
routes.post('/add', authJwt, validate(Validations.addDebt), addCustomerDebt);
routes.delete('/:id', authJwt, deleteCustomer);

export default routes;
