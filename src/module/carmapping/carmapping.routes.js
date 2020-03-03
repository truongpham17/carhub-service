import { Router } from 'express';
import {
  getCarMapping,
  createCarMapping,
  updateCarMapping,
  removeCarMapping,
  getCarMappingById,
  getCarMappingByCustomer,
  getCarMappingByHub,
} from './carmapping.controller';

const routes = new Router();

routes.get('/', getCarMapping);
routes.get('/:id', getCarMappingById);
routes.get('/customer/:customerId', getCarMappingByCustomer);
routes.get('/hub/:hubId', getCarMappingByHub);
routes.post('/', createCarMapping);
routes.put('/:id', updateCarMapping);
routes.delete('/:id', removeCarMapping);

export default routes;
