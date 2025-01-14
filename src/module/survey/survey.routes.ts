'use strict';

import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { event } from '../survey/survey.controller';

const router: Router = Router();

router.get('/event', auth.checkBearerToken, event.index);
router.get('/event/:id', auth.checkBearerToken, event.detail);
router.post('/event', auth.checkBearerToken, event.create);
router.put('/event/:id', auth.checkBearerToken, event.update);
router.delete('/event/:id', auth.checkBearerToken, event.delete);

router.get('/client/:id', auth.checkBearerToken, event.clientSurvey);
router.post('/answer', auth.checkBearerToken, event.createAnswer);

export default router;
