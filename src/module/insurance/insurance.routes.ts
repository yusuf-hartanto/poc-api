'use strict';

import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { client } from '../insurance/client/client.controller';
import { policy } from '../insurance/policy/policy.controller';

const router: Router = Router();

router.get(
  '/client/all-data',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.list
);
router.get(
  '/client',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.index
);
router.get(
  '/client/relation',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.relation
);
router.get(
  '/client/export/:type',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.export
);
router.get(
  '/client/:id',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.detail
);
router.post(
  '/client',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.create
);
router.put(
  '/client/:id',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.update
);
router.delete(
  '/client/:id',
  auth.checkBearerToken,
  auth.checkAccess('client'),
  client.delete
);

router.get(
  '/policy',
  auth.checkBearerToken,
  auth.checkAccess('policy'),
  policy.index
);
router.get(
  '/policy/:id',
  auth.checkBearerToken,
  auth.checkAccess('policy'),
  policy.detail
);
router.post(
  '/policy',
  auth.checkBearerToken,
  auth.checkAccess('policy'),
  policy.create
);
router.put(
  '/policy/:id',
  auth.checkBearerToken,
  auth.checkAccess('policy'),
  policy.update
);
router.delete(
  '/policy/:id',
  auth.checkBearerToken,
  auth.checkAccess('policy'),
  policy.delete
);

export default router;
