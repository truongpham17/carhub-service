import { Router } from 'express';
import validate from 'express-validation';
import { auth } from '../../service/passport';
import logValidation from './log.validation';

import {
  getLogList,
  getLog,
  createLog,
  removeLog,
  updateLog,
} from './log.controller';

const routes = new Router();
routes.get('/', auth, getLogList);
routes.get('/:id', auth, getLog);
routes.post('/', auth, createLog);
routes.put('/:id', auth, validate(logValidation.updateLog), updateLog);
routes.delete('/:id', auth, removeLog);
