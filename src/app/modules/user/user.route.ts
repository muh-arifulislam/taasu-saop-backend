import express from 'express';
import { UserControllers } from './user.controller';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/register',

  validateAuth(USER_ROLE.superAdmin),
  UserControllers.addUser,
);

export const UserRoutes = router;
