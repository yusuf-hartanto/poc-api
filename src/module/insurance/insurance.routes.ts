'use strict';

import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { client } from '../insurance/client/client.controller';

const router: Router = Router();

router.get('/client/all-data', auth.checkBearerToken, client.list);
router.get('/client', auth.checkBearerToken, client.index);
router.post('/client', auth.checkBearerToken, client.create);
router.put('/client/:id', auth.checkBearerToken, client.update);
router.delete('/client/:id', auth.checkBearerToken, client.delete);

export default router;
