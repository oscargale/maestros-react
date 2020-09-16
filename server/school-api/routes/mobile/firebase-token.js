import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { FirebaseValidations,FirebaseTokenController } from '../../api/firebase-token'

const router = express.Router();

router.post('/',
  [JwtAuthentication, FirebaseValidations.refreshToken],
  FirebaseTokenController.refreshToken);

export default router;
