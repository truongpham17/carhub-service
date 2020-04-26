import { Router } from 'express';
import { getNotification, getNotifications } from './notification.controllers';
import { auth } from '../../service/passport';

const routes = new Router();

routes.get('/', auth, getNotifications);
routes.get('/:id', auth, getNotification);

export default routes;
