import { Router } from 'express';
import validate from 'express-validation';
import {
  getLeaseList,
  getLease,
  addLease,
  updateLease,
  // submitTransaction,
} from './lease.controller';
import validation from './lease.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getLeaseList);
routes.get('/:id', auth, getLease);
routes.post('/', auth, validate(validation.addLease), addLease);

// routes.post('/transaction/:id', auth, submitTransaction);
routes.patch('/:id', auth, validate(validation.updateLease), updateLease);

export default routes;
