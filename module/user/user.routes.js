import validate from 'express-validation';
import { Router } from 'express';
import {
  getUserList,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from './user.controllers';
import Validations from './user.validations';
import { authLocal, authJwt } from '../../service/passport';
import { OwnOrAdmin } from './user.role';
import { roleAdmin } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAdmin, getUserList);
routes.get('/:id', authJwt, roleAdmin, getUser);

routes.post('/login', validate(Validations.login), authLocal);
routes.post('/add', validate(Validations.createUser), createUser);
routes.post('/register', validate(Validations.register), createUser);
routes.patch('/:id', authJwt, OwnOrAdmin, validate(Validations.editProfile), updateUser);
routes.delete('/:id', authJwt, roleAdmin, deleteUser);

export default routes;
