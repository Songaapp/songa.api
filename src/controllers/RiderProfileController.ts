import { Request, Response } from "express";
import { CheckRiderResult, checkRider } from "../helpers/user";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createRiderProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { location, avatar, address, gender, documents, bikeInformation } =
    req.body;

  //check Rider
  const riderExists = (await checkRider({ id })) as CheckRiderResult;
  if (!riderExists.riderPresent) {
    res.status(400).json({
      message:
        "Rider not present. To have a profile, a rider must have an account",
    });
  }

  if (riderExists.rider) {
    //create their profile
    const riderProfile = await prisma.riderProfile.create({
      data: {
        riderId: riderExists.rider.id,
        location: location || null,
        avatar: avatar || null,
        address: address || null,
        gender: gender || null,
        documents: documents || undefined,
        bikeInformation: bikeInformation || undefined,
      },
    });
    console.log(riderProfile);
  }
};

export const updateRiderProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  //check Rider
  const riderExists = (await checkRider({ id })) as CheckRiderResult;
  if (!riderExists.riderPresent) {
    res.status(400).json({
      message:
        "Rider not present. To have a profile, a rider must have an account",
    });
  }
  res.send("rider profile update");
};
export const deleteRiderProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  //check Rider
  const riderExists = (await checkRider({ id })) as CheckRiderResult;
  if (!riderExists.riderPresent) {
    res.status(400).json({
      message:
        "Rider not present. To have a profile, a rider must have an account",
    });
  }
  res.send("rider profile delete");
};
