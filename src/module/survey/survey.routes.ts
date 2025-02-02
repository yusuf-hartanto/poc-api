'use strict';

import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { event } from '../survey/survey.controller';

const router: Router = Router();

router.get(
  '/event',
  auth.checkBearerToken,
  auth.checkAccess('event'),
  event.index
);
router.get(
  '/event/:id',
  auth.checkBearerToken,
  auth.checkAccess('event'),
  event.detail
);
router.post(
  '/event',
  auth.checkBearerToken,
  auth.checkAccess('event'),
  event.create
);
router.put(
  '/event/:id',
  auth.checkBearerToken,
  auth.checkAccess('event'),
  event.update
);
router.delete(
  '/event/:id',
  auth.checkBearerToken,
  auth.checkAccess('event'),
  event.delete
);

router.get(
  '/client/:id',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  event.clientSurvey
);
router.post('/answer', auth.checkBearerToken, event.createAnswer);

export default router;
