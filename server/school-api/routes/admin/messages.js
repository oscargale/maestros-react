import express from 'express';
import { JwtAuthentication } from '../../../config/passport';
import { MessagesController, MessagesValidations } from '../../api/admin/messages';

const router = express.Router();

router.get('/', MessagesController.getAll);
router.get('/remember-payments', MessagesController.getRememberPayments);
router.get('/new', MessagesController.getNew);
//router.get('/aa', MessagesController.sendMessageForm);
router.post('/send', MessagesController.sendMessage);
router.post('/send-remember-payments', MessagesController.sendMessageRememberPayment);


/*
router.post('/sendMessageToDebtors', SendMessageValidations.sendMessageToDebtors, SendMessageController.sendMessageToDebtors);
*/

export default router;
