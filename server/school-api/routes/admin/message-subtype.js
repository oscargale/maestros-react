import express from 'express';
import { MessageSubtypeController, MessageSubtypeValidations } from '../../api/admin/messages-subtypes';
import { JwtAdminAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/', JwtAdminAuthentication, MessageSubtypeController.getAll);
router.get('/new', JwtAdminAuthentication, MessageSubtypeController.getNew);
router.get('/:id', JwtAdminAuthentication, MessageSubtypeController.find);
router.put('/:id', [JwtAdminAuthentication, MessageSubtypeController.update], MessageSubtypeController.update);
router.delete('/:id', JwtAdminAuthentication, MessageSubtypeController.delete);
router.post('/', [JwtAdminAuthentication, MessageSubtypeController.save], MessageSubtypeController.save);

export default router;
