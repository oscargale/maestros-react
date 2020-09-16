import express from 'express';
import { PaymentController } from '../../api/payments';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.get('/', 
    JwtAuthentication,
    PaymentController.getMyPaymentStatus);

export default router;
