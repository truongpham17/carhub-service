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
  getLatestSharingByRental,
  removeLatestSharingByRental,
  confirmSharing,
  suggestSharing,
  createSharingFromRental,
} from './sharing.controller';
import Validations from './sharing.validations';

const routes = new Router();

routes.get('/', auth, getSharing);
routes.get('/:id', auth, getSharingById);
routes.get('/rental/:id', auth, getSharingByRentalId);
routes.get('/latest/rental/:id', auth, getLatestSharingByRental);

routes.post('/', auth, validate(Validations.addSharing), addSharing);
routes.post(
  '/createSharingFromRental',
  auth,
  validate(Validations.createFromRental),
  createSharingFromRental
);
routes.post('/confirm/rental/:id', auth, confirmSharing);
routes.post('/suggestion', auth, suggestSharing);

routes.patch('/:id', auth, validate(Validations.updateSharing), updateSharing);

routes.delete('/:id', auth, removeSharing);
routes.delete('/latest/rental/:id', auth, removeLatestSharingByRental);

export default routes;
