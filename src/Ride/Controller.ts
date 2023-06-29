import { Request, Response } from 'express';
import s2 from '@radarlabs/s2';
import { AsyncLocalStorage } from 'node:async_hooks';

const GetUserLatLong = (userId: string, LongLat: [number, number]) => {
  return [
    userId,
    new s2.CellId(new s2.LatLng(LongLat[1], LongLat[0])).parent(9),
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
  let ridersArray = [];
  ridersArray = riders.map((item): any => GetUserLatLong(item[0], item[1]));
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

export const RiderPostLocation = (req: Request, res: Response) => {};
export const UserGetNearbyRides = (req: Request, res: Response) => {};
export const UserRequestRide = (req: Request, res: Response) => {};
export const RiderGetRequestedRides = (req: Request, res: Response) => {};// websockets
export const RiderAcceptRide = (req: Request, res: Response) => {};//websockets
export const UserNotifiedRide = (req: Request, res: Response) => {};//websockets
export const UserRiderShareLocation = (req: Request, res: Response) => {};//websockets
export const UserCancelRide = (req: Request, res: Response) => {};//Rest -> driver websockets
export const RiderCancelRide = (req: Request, res: Response) => {};//rest -> . user via sockets