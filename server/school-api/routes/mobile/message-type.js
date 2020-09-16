import express from 'express';
import { MessageTypeController } from '../../api/messages-types';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/', JwtAuthentication, MessageTypeController.getAll);

export default router;
