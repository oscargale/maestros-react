import express from 'express';

// Import the module routes
import AuthRoutes from './web/auth';
import OfficialGradesRoutes from './web/official-grades';
import OptionalGradesRoutes from './web/optional-grades';
import FaltasOficialesRoutes from './web/faltas-oficiales';
import FaltasOptativasRoutes from './web/faltas-optativas';
/*
import MessageTypeRoutes from './mobile/message-type';
import FeedRoutes from './mobile/feed';
import InitialDataRoutes from './mobile/initial-data';
import PaymentRoutes from './mobile/payment';
import InformationRoutes from './mobile/information';
import FirebaseTokenRoutes from './mobile/firebase-token';
*/

const router = express.Router();

// Default get route
router.get('/', (req, res) => res.end('School News API'));

//// APP Routes
router.use('/auth', AuthRoutes);
router.use('/official-grades', OfficialGradesRoutes);
router.use('/optional-grades', OptionalGradesRoutes);
router.use('/faltas-oficiales', FaltasOficialesRoutes);
router.use('/faltas-optativas', FaltasOptativasRoutes);


// Error handling
router.use((err, req, res, next) => {
  /*
   * Remove Error's `stack` property. We don't want
   * users to se this at the production env
   */
  if (req.app.get('env') === 'development') {
    console.log(err); // eslint-disable-line no-console
  }

  /* Finally respond to the request using our wrapper */
  if (err.status) {
    res.status(err.status || 500).jsonp(err);
  } else {
    res.status(500).jsonp({message: 'Something went wrong!'});
  }

  next();
});

export default router;
