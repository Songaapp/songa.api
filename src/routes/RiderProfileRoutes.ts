import { Router } from "express";
import express from "express";
import {
  createRiderProfile,
  deleteRiderProfile,
  updateRiderProfile,
} from "../controllers/RiderProfileController";
import { addBikeInfo } from "../controllers/BikeInfoControllers";

const router: Router = express();

router.post("/create-profile/:id", createRiderProfile);
router.put("/update-profile/:id", updateRiderProfile);
router.delete("/delete-profile/:id", deleteRiderProfile);
router.post("/add-bike-info/:id", addBikeInfo);

export default router;
