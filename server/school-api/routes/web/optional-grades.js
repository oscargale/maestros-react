import express from 'express';
import { OptionalGradesController } from '../../api/optional-grades';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/materias-oficiales', 
    JwtAuthentication,
    OptionalGradesController.getOptionalGrades);

export default router;