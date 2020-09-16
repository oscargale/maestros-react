import express from 'express';

import { PaymentController } from '../../api/admin/payments';

const router = express.Router();

router.get('/check', PaymentController.checkPayments);

export default router;
