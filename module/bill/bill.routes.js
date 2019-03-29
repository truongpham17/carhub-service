import validate from 'express-validation';
import { Router } from 'express';
import * as Controllers from './bill.controllers';
import Validations from './bill.validations';
import { authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, Controllers.getBillList);
routes.get('/:id', authJwt, Controllers.getBillDetail);
routes.post('/', authJwt, validate(Validations.createBill), Controllers.createBill);

export default routes;
