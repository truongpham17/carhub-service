import { Router } from 'express';
import validate from 'express-validation';
import { auth } from '../../service/passport';
import {
  getSharing,
  getSharingById,
  addSharing,
  updateSharing,
  removeSharing,
  getSharingByRentalId,
} from './sharing.controller';
import Validations from './sharing.validations';

const routes = new Router();

routes.get('/', getSharing);
routes.get('/:id', auth, getSharingById);
routes.post('/', auth, validate(Validations.addSharing), addSharing);
routes.patch('/:id', auth, validate(Validations.updateSharing), updateSharing);
routes.delete('/:id', auth, removeSharing);
routes.get('/rental/:id', auth, getSharingByRentalId);

export default routes;
