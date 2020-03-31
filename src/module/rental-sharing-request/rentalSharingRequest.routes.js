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
  getRentalSharingByCustomer,
  acceptRentalSharingRequest,
  declineRentalSharingRequest,
} from './rentalSharingRequest.controller';

const routes = new Router();
routes.get('/', auth, getRentalSharingRequest);
routes.get('/customer', auth, getRentalSharingByCustomer);
routes.get('/sharing/:id', auth, getRentalRequestBySharing);

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

routes.patch('/accept/:id', auth, acceptRentalSharingRequest);

routes.patch('/decline/:id', auth, declineRentalSharingRequest);

routes.delete('/:id', auth, deleteRentalSharingRequest);

export default routes;
