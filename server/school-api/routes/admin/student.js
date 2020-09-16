import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { StudentController } from '../../api/admin/students';

const router = express.Router();

router.post('/search', StudentController.search);

export default router;
