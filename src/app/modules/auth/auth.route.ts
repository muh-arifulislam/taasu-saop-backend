import express from 'express';
import { AuthControllers } from './auth.controller';
import { UserControllers } from '../user/user.controller';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

router.post('/register', UserControllers.addUser);

export const AuthRoutes = router;
