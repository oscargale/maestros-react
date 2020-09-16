import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { InitialDataController } from '../../api/initial-data'

const router = express.Router();

router.get('/',
  JwtAuthentication,
  InitialDataController.getInitialData);

export default router;
