import express from 'express';
import { FaltasOptativasController } from '../../api/faltas-optativas';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.post('/alumnos-faltas-optativas', 
    JwtAuthentication,
    FaltasOptativasController.getCapturaFaltasOptional);

router.post('/materia-faltas-optativas', 
    JwtAuthentication,
    FaltasOptativasController.postFaltasOptativas);
export default router;