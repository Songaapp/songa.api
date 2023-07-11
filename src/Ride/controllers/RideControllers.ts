import { PrismaClient, TripStatus } from '@prisma/client';
import { Response, Request } from 'express';
import { checkRider, checkUser } from '../../helpers/user';
const prisma = new PrismaClient();
export const RequestRide = async (req: Request, res: Response) => {
  const {
    pickupPointLat,
    pickupPointLong,
    destinationLat,
    destinationLong,
    userId,
  } = req.body;
  try {
    //check user
    const id = userId;
    const userExists = await checkUser({ id });
    if (!userExists?.userPresent) {
      res.status(401).json({
        message:
          'user not found. User Must have an account in order to request for rides. Please confirm the user ID.',
      });
      return;
    }

    //check active rides

    //create ride

    const newRide = await prisma.ride.create({
      data: {
        userId: userId,
        pickupPointLat: pickupPointLat,
        pickupPointLong: pickupPointLong,
        destinationLat: destinationLat,
        destinationLong: destinationLong,
        status: 'PENDING',
      },
      select: {
        id: true,
        userId: true,
        pickupPointLat: true,
        pickupPointLong: true,
        destinationLat: true,
        destinationLong: true,
      },
    });

    res.status(200).json({
      message: `successfully created ride for user with ID: ${userExists.user?.id}`,
      rideInfo: newRide,
    });
  } catch (err: any) {
    res.status(400).json({
      message: 'Something went wrong. Please try again.',
      err: err.message,
    });
  }
};
export const AcceptRide = async (req: Request, res: Response) => {
  try {
    const { riderId, rideId } = req.body;

    //check ride
    const rideExists = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!rideExists) {
      res.status(400).json({
        Message:
          'Ride with the provided ID does not exist. Please confirm the ride ID',
      });
      return;
    }
    //ensure that the ride is still active
    if (
      rideExists.status === 'COMPLETED' ||
      rideExists.status === 'ENROUTE' ||
      rideExists.status === 'CANCELLED'
    ) {
      res.status(400).json({
        message:
          "Cannot accept ride. It's status may be either completed or enroute or cancelled. This is an invalid ride",
      });
      return;
    }
    //ensure that it has not been accepted by another rider
    if (rideExists.riderId) {
      res.status(401).json({
        message:
          'Ride cannot be accepted. It already has a rider assigned to it.',
      });
      return;
    }
    //check rider
    const id = riderId;
    const riderExists = await checkRider({ id });
    if (!riderExists?.riderPresent) {
      res.status(401).json({
        message: 'Cannot accept ride. Rider with that ID does not exist.',
      });
      return;
    }
    //update the rider when they accept ride. ie. the riderId.
    const updatedRide = await prisma.ride.update({
      where: {
        id: rideId,
      },
      data: {
        riderId: riderId,
        status: 'ASSIGNED',
      },
    });
    //notify the user

    res.status(200).json({
      message: `Ride succesfully assigned to rider  with ID: ${riderId}`,
      rideInfo: updatedRide,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong. Please try again.' });
  }
};
export const StartRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.body;

    //check ride
    const rideExists = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!rideExists) {
      res.status(400).json({
        Message:
          'Ride with the provided ID does not exist. Please confirm the ride ID',
      });
      return;
    }
    //ensure that the ride is still active
    if (
      rideExists.status === 'COMPLETED' ||
      rideExists.status === 'ENROUTE' ||
      rideExists.status === 'CANCELLED' ||
      rideExists.status === 'PENDING'
    ) {
      res.status(400).json({
        message:
          "Cannot start ride. It's status may be either completed or enroute or cancelled or it may not have a rider assigned to it. This is an invalid ride",
      });
      return;
    }

    //update the status and start time
    const updatedRide = await prisma.ride.update({
      where: {
        id: rideId,
      },
      data: {
        startTime: new Date(),
        status: 'ENROUTE',
      },
    });
    //notify the user

    res.status(200).json({
      message: `Started ride with ID ${rideId}`,
      rideInfo: updatedRide,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong. Please try again.' });
  }
};
export const CancelRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.body;

    //check ride
    const rideExists = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!rideExists) {
      res.status(400).json({
        Message:
          'Ride with the provided ID does not exist. Please confirm the ride ID',
      });
      return;
    }
    //ensure that the ride is still active
    if (rideExists.status === 'COMPLETED') {
      res.status(400).json({
        message: 'cannot cancel ride. It has already been completed.',
      });
      return;
    }

    //update the status
    const updatedRide = await prisma.ride.update({
      where: {
        id: rideId,
      },
      data: {
        status: 'CANCELLED',
      },
    });
    //notify the user

    res.status(200).json({
      message: `Cancelled ride with ID ${rideId}`,
      rideInfo: updatedRide,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong. Please try again.' });
  }
};
export const GetRideInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    //check ride
    const rideExists = await prisma.ride.findUnique({ where: { id: id } });
    if (!rideExists) {
      res.status(400).json({
        Message:
          'Ride with the provided ID does not exist. Please confirm the ride ID',
      });
      return;
    }
    res
      .status(200)
      .json({ message: 'Fetch successfull', rideInfo: rideExists });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong. Please try again.' });
  }
};
export const GetUserRides = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //check user

    const userExists = await checkUser({ id });
    if (!userExists?.userPresent) {
      res.status(401).json({
        message:
          'user not found. User Must have an account in order to request for rides. Please confirm the user ID.',
      });
      return;
    }
    //check rides
    const rides = await prisma.ride.findMany({
      where: {
        userId: id,
      },
    });
    if (!rides) {
      res.status(200).json({ message: 'This user has no rides' });
    }
    res.status(200).json({ message: 'Fetch successful', rides: rides });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong. Please try again.' });
  }
  //get a specific user or rider rides.
};
export const GetRiderRides = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //check user

    const riderExists = await checkRider({ id });
    if (!riderExists?.riderPresent) {
      res.status(401).json({
        message:
          'rider not found. User Must have an account in order to request for rides. Please confirm the user ID.',
      });
      return;
    }
    //check rides
    const rides = await prisma.ride.findMany({
      where: {
        riderId: id,
      },
    });
    if (!rides) {
      res.status(200).json({ message: 'This rider has no rides' });
    }
    res.status(200).json({ message: 'Fetch successful', rides: rides });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong. Please try again.' });
  }
  //get a specific user or rider rides.
};
export const CompleteRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.body;
    //update ending time, duration, status

    //check ride
    const rideExists = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!rideExists) {
      res.status(400).json({
        Message:
          'Ride with the provided ID does not exist. Please confirm the ride ID',
      });
      return;
    }
    //ensure that the ride is still active
    if (
      rideExists.status === 'COMPLETED' ||
      rideExists.status === 'CANCELLED' ||
      rideExists.status === 'PENDING'
    ) {
      res.status(400).json({
        message:
          'cannot complete a ride that is not enroute. Ride must have been assigned a rider and started.',
      });
      return;
    }

    const timeNow: any = new Date();
    const startTime: any = rideExists.startTime;

    const endTimeMilliSecs = timeNow - startTime;
    const minutes = Math.floor(endTimeMilliSecs / (1000 * 60));


    const completedRide = await prisma.ride.update({
      where: {
        id: rideId,
      },
      data: {
        durationTaken: minutes,
        status: 'COMPLETED',
        endingTime: timeNow,
      },
    });
    res.status(200).json({
      message: `completed ride with ID ${rideId}`,
      rideInfo: completedRide,
    });
    //payments
    //update duration
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong. Please try again' });
  }
};
