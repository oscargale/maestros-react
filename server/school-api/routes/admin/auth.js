import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { AdminAuthController, AdminAuthValidations } from '../../api/admin/auth';

const router = express.Router();

router.post('/',
  AdminAuthValidations.login,
  AdminAuthController.login);

export default router;
