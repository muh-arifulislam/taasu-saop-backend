import express from 'express';
import { AuthControllers } from './auth.controller';
import { UserControllers } from '../user/user.controller';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

router.post('/register', UserControllers.addUser);

router.post(
  '/change-password',
  validateAuth(
    USER_ROLE.customer,
    USER_ROLE.moderator,
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
  ),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
