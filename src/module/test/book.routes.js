import { Router } from 'express';
import {
  getBookList,
  addBook,
  deleteBook,
  updateBook,
} from './book.controllers';

const routes = new Router();

routes.get('/', getBookList);
routes.post('/add', addBook);
routes.delete('/:id', deleteBook);
routes.patch('/:id', updateBook);

export default routes;
