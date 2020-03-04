import validate from 'express-validation';
import { Router } from 'express';
import {
  getEmployeeList,
  getEmployee,
  createEmployee,
  updateEmployee,
} from './employee.controllers';
import Validations from './employee.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getEmployeeList);
routes.get('/:id', auth, getEmployee);
routes.post('/', auth, validate(Validations.createEmployee), createEmployee);
routes.patch(
  '/:id',
  auth,
  validate(Validations.updateEmployee),
  updateEmployee
);

export default routes;
