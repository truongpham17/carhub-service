import { Router } from 'express';
import validate from 'express-validation';
import {
  getLicenseList,
  addLicense,
  deleteLicense,
  updateLicense,
} from './license.controller';
import validation from './license.validations';

const routes = new Router();

routes.get('/', getLicenseList);
routes.post('/', validate(validation.addLicense), addLicense);
routes.delete('/:id', deleteLicense);
routes.patch('/:id', validate(validation.updateLicense), updateLicense);

export default routes;
