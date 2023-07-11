import express, { Router } from 'express';
import {
  AcceptRide,
  CompleteRide,
  GetRideInfo,
  GetRiderRides,
  GetUserRides,
  RequestRide,
  StartRide,
} from '../controllers/RideControllers';

const router: Router = express.Router();

router.post('/request-ride', RequestRide);
router.patch('/accept-ride', AcceptRide);
router.patch('/start-ride', StartRide);
router.patch('/complete-ride', CompleteRide);
router.get('get-ride-info/:id', GetRideInfo);
router.get('/get-user-rides/:id', GetUserRides);
router.get('/get-rider-rides/:id', GetRiderRides);
router.get('/get-ride-info/:id', GetRideInfo);

export default router;
