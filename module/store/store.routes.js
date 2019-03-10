import validate from 'express-validation';
import { Router } from 'express';
import * as StoreControllers from './store.controllers';
import Validations from './store.validations';
import { authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, StoreControllers.getStoreList);
routes.post('/', authJwt, validate(Validations.createStore), StoreControllers.createStore);
routes.patch('/:id', authJwt, validate(Validations.editStore), StoreControllers.updateStore);
routes.delete('/:id', authJwt, StoreControllers.deleteStore);

export default routes;
