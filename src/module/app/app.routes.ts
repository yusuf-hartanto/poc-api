'use strict';

import { Router } from 'express';
import { role } from './role/role.controller';
import { menu } from './menu/menu.controller';
import { auth } from '../auth/auth.middleware';
import { resource } from './resource/resource.controller';
import { roleMenu } from './role.menu/role.menu.controller';
import { paramGlobal } from './param.global/param.global.controller';

const router: Router = Router();

router.get(
  '/role/all-data',
  auth.checkBearerToken,
  auth.checkAccess('role'),
  role.list
);
router.get(
  '/role',
  auth.checkBearerToken,
  auth.checkAccess('role'),
  role.index
);
router.post(
  '/role',
  auth.checkBearerToken,
  auth.checkAccess('role'),
  role.create
);
router.put(
  '/role/:id',
  auth.checkBearerToken,
  auth.checkAccess('role'),
  role.update
);
router.delete(
  '/role/:id',
  auth.checkBearerToken,
  auth.checkAccess('role'),
  role.delete
);

router.get(
  '/menu/all-data',
  auth.checkBearerToken,
  auth.checkAccess('menu'),
  menu.list
);
router.get(
  '/menu',
  auth.checkBearerToken,
  auth.checkAccess('menu'),
  menu.index
);
router.post(
  '/menu',
  auth.checkBearerToken,
  auth.checkAccess('menu'),
  menu.create
);
router.put(
  '/menu/:id',
  auth.checkBearerToken,
  auth.checkAccess('menu'),
  menu.update
);
router.delete(
  '/menu/:id',
  auth.checkBearerToken,
  auth.checkAccess('menu'),
  menu.delete
);

router.get(
  '/role-menu/all-data',
  auth.checkBearerToken,
  auth.checkAccess('role menu'),
  roleMenu.list
);
router.get(
  '/role-menu',
  auth.checkBearerToken,
  auth.checkAccess('role menu'),
  roleMenu.index
);
router.post(
  '/role-menu',
  auth.checkBearerToken,
  auth.checkAccess('role menu'),
  roleMenu.create
);

router.get('/param-global/all-data', auth.checkToken, paramGlobal.list);
router.get('/param-global', auth.checkToken, paramGlobal.index);
router.get('/param-global/detail', auth.checkToken, paramGlobal.detail);
router.post(
  '/param-global',
  auth.checkBearerToken,
  auth.checkAccess('global param'),
  paramGlobal.create
);
router.put(
  '/param-global/:id',
  auth.checkBearerToken,
  auth.checkAccess('global param'),
  paramGlobal.update
);
router.delete(
  '/param-global/:id',
  auth.checkBearerToken,
  auth.checkAccess('global param'),
  paramGlobal.delete
);

router.get(
  '/resource',
  auth.checkBearerToken,
  auth.checkAccess('user'),
  resource.index
);
router.get(
  '/resource/check/:username',
  auth.checkBearerToken,
  auth.checkAccess('user'),
  resource.check
);
router.get(
  '/resource/:id',
  auth.checkBearerToken,
  auth.checkAccess('user'),
  resource.detail
);
router.post(
  '/resource',
  auth.checkBearerToken,
  auth.checkAccess('user'),
  resource.create
);
router.put(
  '/resource/:id',
  auth.checkBearerToken,
  auth.checkAccess('user'),
  resource.update
);
router.delete(
  '/resource/:id',
  auth.checkBearerToken,
  auth.checkAccess('user'),
  resource.delete
);

export default router;
