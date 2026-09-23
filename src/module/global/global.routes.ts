'use strict';

import express from 'express';
import { global } from './global.controller';
import { auth } from '../auth/auth.middleware';
import { upload } from '../upload/upload.controller';

const router = express.Router();

router.get('/', global.index);
router.get('/health', global.health);
router.post('/sendmail', global.sendmail);
router.post('/sendtele', global.sendtele);
router.get('/navigation', auth.checkToken, global.navigation);
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
router.get(
  '/dashboard/excel',
  auth.checkBearerToken,
  auth.checkAccess('dashboard'),
  global.dashboardExcel
);
router.get(
  '/dashboard/pdf',
  auth.checkBearerToken,
  auth.checkAccess('dashboard'),
  global.dashboardPDF
);
router.post('/upload', upload.upload);

export default router;
