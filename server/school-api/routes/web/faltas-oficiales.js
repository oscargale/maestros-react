import express from 'express';
import { FaltasOficialesController } from '../../api/faltas-oficiales';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/faltas', 
    JwtAuthentication,
    FaltasOficialesController.getFaltas);

router.post('/faltas-alumnos', 
    JwtAuthentication,
    FaltasOficialesController.getCapturaFaltas);

router.post('/faltas-oficiales-faltas', 
    JwtAuthentication,
    FaltasOficialesController.postFaltasOficiales);

export default router;