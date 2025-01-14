'use strict';

import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { client } from '../insurance/client/client.controller';
import { policy } from '../insurance/policy/policy.controller';

const router: Router = Router();

router.get('/client/all-data', auth.checkBearerToken, client.list);
router.get('/client', auth.checkBearerToken, client.index);
router.get('/client/:id', auth.checkBearerToken, client.detail);
router.post('/client', auth.checkBearerToken, client.create);
router.put('/client/:id', auth.checkBearerToken, client.update);
router.delete('/client/:id', auth.checkBearerToken, client.delete);

router.get('/policy', auth.checkBearerToken, policy.index);
router.get('/policy/:id', auth.checkBearerToken, policy.detail);
router.post('/policy', auth.checkBearerToken, policy.create);
router.put('/policy/:id', auth.checkBearerToken, policy.update);
router.delete('/policy/:id', auth.checkBearerToken, policy.delete);

export default router;
