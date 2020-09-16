import express from 'express';
import { MessageTypeController, MessageTypeValidations } from '../../api/admin/messages-types';
import { JwtAdminAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/', JwtAdminAuthentication, MessageTypeController.getAll);
router.get('/:id', JwtAdminAuthentication, MessageTypeController.find);
router.put('/:id', [JwtAdminAuthentication, MessageTypeValidations.update], MessageTypeController.update);
router.delete('/:id', JwtAdminAuthentication, MessageTypeController.delete);
router.post('/', [JwtAdminAuthentication, MessageTypeValidations.save], MessageTypeController.save);

export default router;
