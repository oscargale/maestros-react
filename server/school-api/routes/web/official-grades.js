import express from 'express';
import { GradesController } from '../../api/official-grades';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/materias-oficiales', 
    JwtAuthentication,
    GradesController.getGrades);

router.post('/materias-alumnos',
    JwtAuthentication,
    GradesController.getCaptura);

router.post('/materias-oficiales-calificaciones',
    JwtAuthentication,
    GradesController.postCalificaciones);

export default router;