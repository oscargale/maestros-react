import express from 'express';
import { FaltasOficialesController } from '../../api/faltas-oficiales';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/faltas', 
    JwtAuthentication,
    FaltasOficialesController.getFaltas);

export default router;