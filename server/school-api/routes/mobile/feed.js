import express from 'express';
import { FeedController, FeedValidation } from '../../api/feed';
import { JwtAuthentication } from '../../../config/passport';

const router = express.Router();

router.post('/', 
    [ JwtAuthentication, FeedValidation.getMessages ],
    FeedController.getMessages);

export default router;
