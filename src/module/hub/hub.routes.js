import { Router } from 'express';

import { getHub, createHub, updateHub, removeHub } from './hub.controller';

const routes = new Router();

routes.get('/', getHub);
routes.post('/', createHub);
routes.put('/:id', updateHub);
routes.delete('/:id', removeHub);

export default routes;
