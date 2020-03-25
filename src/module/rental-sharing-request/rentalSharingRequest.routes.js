import { Router } from 'express';
import validate from 'express-validation';
import { auth } from '../../service/passport';
import Validation from './rentalSharingRequest.validations';
import {
  getRentalSharingRequest,
  addRentalSharingRequest,
  updateRentalSharingRequest,
  deleteRentalSharingRequest,
  getRentalRequestBySharing,
} from './rentalSharingRequest.controller';

const routes = new Router();
routes.get('/', auth, getRentalSharingRequest);
routes.post(
  '/',
  auth,
  validate(Validation.addSharingRequest),
  addRentalSharingRequest
);
routes.patch(
  '/:id',
  auth,
  validate(Validation.updateSharingRequest),
  updateRentalSharingRequest
);
routes.delete('/:id', auth, deleteRentalSharingRequest);
routes.get('/sharing/:id', auth, getRentalRequestBySharing);

export default routes;
