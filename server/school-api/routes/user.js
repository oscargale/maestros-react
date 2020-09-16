import express from 'express';
import { UserController, UserValidations } from '../api/user';

const router = express.Router();

router.post('/',
  UserValidations.signUp,
  UserController.signUp);

export default router;
