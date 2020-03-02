import { Router } from 'express';
import validate from 'express-validation';
import {
  getCardList,
  addCard,
  deleteCard,
  updateCard,
} from './card.controller';
import validation from './card.validtions';

const routes = new Router();

routes.get('/', getCardList);
routes.post('/', validate(validation.addCard), addCard);
routes.delete('/:id', deleteCard);
routes.patch('/:id', validate(validation.updateCard), updateCard);

export default routes;
