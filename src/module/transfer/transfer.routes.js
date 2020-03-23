import { Router } from 'express';
import {
  getTransferList,
  getTransfer,
  createTransfer,
  removeTransfer,
  updateTransfer,
} from './transfer.controller';
// import validation from './lease.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getTransferList);
routes.get('/:id', auth, getTransfer);
routes.post('/', auth, createTransfer);
routes.delete('/:id', auth, removeTransfer);
routes.put('/:id', auth, updateTransfer);

export default routes;
