import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { UserAuthController, UserAuthValidations } from '../../api/auth';

const router = express.Router();

router.post('/',
  UserAuthValidations.login,
  UserAuthController.login);

router.get('/me',
  JwtAuthentication,
  UserAuthController.me);

export default router;
