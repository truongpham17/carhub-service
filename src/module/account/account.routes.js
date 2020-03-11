import validate from 'express-validation';
import { Router } from 'express';
import {
  getAccountList,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  login,
} from './account.controllers';
import Validations from './account.validations';
import { authLocal, authJwt, auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getAccountList);
routes.get('/:id', auth, getAccount);
routes.post('/login', validate(Validations.login), login);
routes.post('/signUp', validate(Validations.createUser), createAccount);
routes.patch('/:id', auth, validate(Validations.editProfile), updateAccount);
routes.delete('/:id', auth, deleteAccount);

export default routes;
