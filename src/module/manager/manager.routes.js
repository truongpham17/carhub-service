import validate from 'express-validation';
import { Router } from 'express';
import {
  getManagerList,
  getManager,
  createManager,
  updateManager,
} from './manager.controllers';
import Validations from './manager.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getManagerList);
routes.get('/:id', auth, getManager);
routes.post('/', auth, validate(Validations.createManager), createManager);
routes.patch('/:id', auth, validate(Validations.updateManager), updateManager);

export default routes;
