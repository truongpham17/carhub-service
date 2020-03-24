import { Router } from 'express';
<<<<<<< HEAD
=======
// import validate from 'express-validation';
>>>>>>> f505ef6338543e2c9f18a3f5991f90e36be8f410
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
routes.delete('/:id', auth, deleteTransaction);
routes.put('/:id', auth, updateTransaction);

export default routes;
