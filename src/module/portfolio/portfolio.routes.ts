'use strict';

import { Router } from 'express';
import { auth } from '../auth/auth.middleware';
import { properties } from '../portfolio/properties/properties.controller';

const router: Router = Router();

router.get(
  '/properties/all-data',
  auth.checkBearerToken,
  auth.checkAccess('properties'),
  properties.list
);
router.get(
  '/properties',
  auth.checkBearerToken,
  auth.checkAccess('properties'),
  properties.index
);
router.get(
  '/properties/:id',
  auth.checkBearerToken,
  auth.checkAccess('properties'),
  properties.detail
);
router.post(
  '/properties',
  auth.checkBearerToken,
  auth.checkAccess('properties'),
  properties.create
);
router.put(
  '/properties/:id',
  auth.checkBearerToken,
  auth.checkAccess('properties'),
  properties.update
);
router.delete(
  '/properties/:id',
  auth.checkBearerToken,
  auth.checkAccess('properties'),
  properties.delete
);

export default router;
