import express from 'express';
import { InformationController } from '../../api/information';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/', 
    JwtAuthentication,
    InformationController.getMyInformation);

export default router;
