import { Router } from 'express';
import validate from 'express-validation';
import {
  getCardList,
  getCard,
  addCard,
  deleteCard,
  updateCard,
} from './card.controller';
import validation from './card.validtions';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getCardList);
routes.get('/:id', auth, getCard);
routes.post('/', auth, validate(validation.addCard), addCard);
routes.delete('/:id', auth, deleteCard);
routes.patch('/:id', auth, validate(validation.updateCard), updateCard);

export default routes;
