import { Router } from 'express';
import {
  getTransactionList,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  addTransaction,
} from './transaction.controller';
// import validation from './lease.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getTransactionList);
routes.get('/:id', auth, getTransaction);
routes.post('/', auth, addTransaction);
routes.delete('/', auth, deleteTransaction);
// routes.patch('/:id', auth, validate(validation.updateLease), updateLease);

export default routes;
