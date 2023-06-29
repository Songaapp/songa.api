import express from 'express';
import {
  RiderCancelRide,
  RiderPostLocation,
  UserCancelRide,
  UserGetNearbyRides,
  UserRequestRide,
} from './Controller';

const router = express.Router();
router.post('/rider-post-locations/', RiderPostLocation);
router.get('/user-get-nearby-riders/', UserGetNearbyRides);
router.post('/user-request-ride/', UserRequestRide);
router.post('/user-cancel-ride/', UserCancelRide);
router.post('/rider-cancel-ride/', RiderCancelRide);

export default router;
