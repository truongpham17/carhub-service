import { Router } from 'express';

import {
  getTest,
  createTest,
  deleteTest,
  updateTest,
  getTestById,
} from './test.controllers';

const routes = new Router();

routes.get('/', getTest);
routes.post('/', createTest);
routes.delete('/:id', deleteTest);
routes.put('/:id', updateTest);
routes.get('/:id', getTestById);
// routes.get('/test', getTestRecord);
// routes.get('/:id', authJwt, getUser);
// routes.post('/login', validate(Validations.login), authLocal);
// routes.post('/add', authJwt, validate(Validations.createUser), createUser);
// routes.patch('/:id', authJwt, validate(Validations.editProfile), updateUser);
// routes.delete('/:id', authJwt, deleteUser);

export default routes;
