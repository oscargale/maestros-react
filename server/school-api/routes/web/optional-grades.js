import express from 'express';
import { OptionalGradesController } from '../../api/optional-grades';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/materias-optativas', 
    JwtAuthentication,
    OptionalGradesController.getOptionalGrades);

router.post('/alumnos-optativas', 
    JwtAuthentication,
    OptionalGradesController.getCapturaOptional);

router.post('/materias-optativas-calificaciones', 
    JwtAuthentication,
    OptionalGradesController.postCalificacionesOptativas);

export default router;