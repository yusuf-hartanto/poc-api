'use strict';

import express from 'express';
import { global } from './global.controller';
import { auth } from '../auth/auth.middleware';

const router = express.Router();

router.get('/', global.index);
router.post('/sendmail', global.sendmail);
router.get('/navigation', global.navigation);
router.post('/update-currency/:currency', global.updateCurrency);
router.get(
  '/dashboard/summary',
  auth.checkBearerToken,
  auth.checkAccess('dashboard'),
  global.summary
);
router.get(
  '/dashboard',
  auth.checkBearerToken,
  auth.checkAccess('dashboard'),
  global.dashboard
);

export default router;
