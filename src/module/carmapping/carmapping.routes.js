import { Router } from 'express';
import {
  getCarMapping,
  createCarMapping,
  updateCarMapping,
  removeCarMapping,
} from './carmapping.controller';

const routes = new Router();

routes.get('/', getCarMapping);
routes.post('/', createCarMapping);
routes.put('/:id', updateCarMapping);
routes.delete('/:id', removeCarMapping);

export default routes;
