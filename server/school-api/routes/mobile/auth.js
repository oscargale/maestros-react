import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { AuthController, AuthValidation } from '../../api/auth';

const router = express.Router();

router.post('/',
  AuthValidation.login,
  AuthController.login);

router.get('/me',
  JwtAuthentication,
  AuthController.me);

export default router;
