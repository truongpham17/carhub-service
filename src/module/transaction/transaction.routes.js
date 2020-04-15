import { Router } from 'express';
// import validate from 'express-validation';
import {
  getTransactionList,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  addTransaction,
  getPaypalAccessToken,
} from './transaction.controller';
// import validation from './lease.validations';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getTransactionList);
routes.get('/paymentToken', auth, getPaypalAccessToken);
routes.get('/:id', auth, getTransaction);
routes.post('/', auth, addTransaction);
routes.delete('/:id', auth, deleteTransaction);
routes.put('/:id', auth, updateTransaction);

export default routes;
