import { Router } from 'express';
import validate from 'express-validation';
import {
  getLicenseList,
  getLicense,
  addLicense,
  deleteLicense,
  updateLicense,
} from './license.controller';
import validation from './license.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getLicenseList);
routes.get('/:id', auth, getLicense);
routes.post('/', auth, validate(validation.addLicense), addLicense);
routes.delete('/:id', auth, deleteLicense);
routes.patch('/:id', auth, validate(validation.updateLicense), updateLicense);

export default routes;
