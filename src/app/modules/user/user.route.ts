import express from 'express';
import { UserControllers } from './user.controller';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.get('/customer', UserControllers.getCustomerUsers);

router.get('/customer/:id', UserControllers.getCustomerWithStats);

router.get(
  '/',
  validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.getAdminUsers,
);

router.get(
  '/me',
  validateAuth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.superAdmin,
    USER_ROLE.moderator,
  ),
  UserControllers.getUser,
);

router.put(
  '/:id',
  validateAuth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.updateUser,
);

router.post(
  '/',
  validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.addUser,
);

router.delete(
  '/:id',
  validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.deleteUser,
);

export const UserRoutes = router;
