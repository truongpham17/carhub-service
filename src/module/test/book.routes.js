import validate from 'express-validation';
import { Router } from 'express';
import { getBooks, addBook, deleteBook, updateBook } from './book.controllers';
import { authLocal, authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', getBooks);
routes.post('/', addBook);
routes.delete('/:id', deleteBook);
routes.patch('/:id', updateBook);

export default routes;
