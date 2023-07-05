import { Request, Response } from 'express';
import s2 from '@radarlabs/s2';
import app from '../app';

const GetUserLatLong = (userId: string, LongLat: [number, number]) => {
  return [
    userId,
    new s2.CellId(new s2.LatLng(LongLat[1], LongLat[0])).parent(10),
  ];
};

const riders: Array<Array<any>> = [
  ['r1', [-1.201726, 36.785418]],
  ['r2', [-1.207343, 36.786401]],
  ['r3', [-1.204948, 36.776498]],
  ['r4', [-1.094669, 36.631879]],
  ['r5', [-1.206408, 36.791688]],
];

export const GeoHarsh = (req: Request, res: Response) => {
  // let ridersArray = [];
  let ridersArray = riders.map((item): any => GetUserLatLong(item[0], item[1]));
  let groups: any = {}; // Initialize groups as an empty object
  ridersArray.forEach(([userId, cellId]) => {
    const group = groups[cellId.token()] || [];
    group.push(userId);
    groups[cellId.token()] = group;
  });

  const searchPointLongLat = [-1.204948, 36.776498];
  const searchPointS2 = new s2.CellId(
    new s2.LatLng(searchPointLongLat[1], searchPointLongLat[0])
  ).parent(9);

  console.log(searchPointS2.token()); // '89c25a4c'
  console.log(groups); // { '89c2595c': [ 'user1', 'user2' ], '89c25a4c': [ 'user3' ] }

  const closePoints = groups[searchPointS2.token()];
  console.log(closePoints); // [ 'user3' ]
  return res.status(200).json(closePoints);
};

export const RiderPostLocation = (req: any, res: Response) => {
  if (typeof app.locals.groups == 'undefined') {
    app.locals.groups = {};
  }
  const { latitude, longitude } = req.body;
  const rider_cell_id = new s2.CellId(new s2.LatLng(latitude, longitude))
    .parent(11)
    .token();
  const group = app.locals.groups[rider_cell_id] || new Set();
  group.add(req.payload.id);
  app.locals.groups[rider_cell_id] = group;
  // console.log(app.locals.groups);
  return res.status(200).json(app.locals.groups);
};

export const UserGetNearbyRides = (req: Request, res: Response) => {
  if (typeof app.locals.groups == 'undefined') {
    app.locals.groups = {};
  }
  const { latitude, longitude } = req.body;
  const customer_point_s2 = new s2.CellId(
    new s2.LatLng(latitude, longitude)
  ).parent(11);
  console.log(app.locals.groups);
  const close_rider_points = app.locals.groups[customer_point_s2.token()];
  // console.log(closePoints); // [ 'user3' ]
  if (!close_rider_points) {
    return res.status(404).json({ message: 'No riders found' });
  }
  return res.status(200).json({
    message: 'Riders found',
    location: Array.from(close_rider_points),
  });
};
export const UserRequestRide = (req: Request, res: Response) => {};
export const RiderGetRequestedRides = (req: Request, res: Response) => {};// websockets
export const RiderAcceptRide = (req: Request, res: Response) => {};//websockets
export const UserNotifiedRide = (req: Request, res: Response) => {};//websockets
export const UserRiderShareLocation = (req: Request, res: Response) => {};//websockets
export const UserCancelRide = (req: Request, res: Response) => {};//Rest -> driver websockets
export const RiderCancelRide = (req: Request, res: Response) => {};//rest -> . user via sockets