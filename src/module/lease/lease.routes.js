import { Router } from 'express';
import validate from 'express-validation';
import { getLeaseList, addLease, updateLease } from './lease.controller';
import validation from './lease.validations';

const routes = new Router();

routes.get('/', getLeaseList);
routes.post('/', validate(validation.addLease), addLease);
routes.patch('/:id', validate(validation.updateLease), updateLease);

export default routes;
