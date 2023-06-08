import express, { Router } from "express";
import {
  CreateRiderAccount,
  DeleteRiderAccount,
  GetRiderProfile,
  LoginRider,
  UpdateRiderAccount,
} from "../controllers/RiderControllers";
import { RiderDocumentsUpload } from "../controllers/DocsUpload";
import {AssignCCAOnRiderCreation} from "../controllers/RidersVerification";
import {validateRiderApprovalStatus} from "../controllers/Validators/CustomerCareAgentValidator";
import {auth} from "../helpers/CreateToken";
const router: Router = express.Router();

const riderEdit = [validateRiderApprovalStatus ]
// const riderEdit = [auth,validateRiderApprovalStatus ]
router.post("/create-rider-account", CreateRiderAccount);
router.post("/login-rider", LoginRider);
router.post("/delete-rider-account/:id", DeleteRiderAccount);
router.post("/documents/upload/:id", RiderDocumentsUpload);
// router.post("/documents/upload/:id", (req: Request, res: Response) => {
//   res.send("documents");
// });router.post("/delete-rider-account/:id", DeleteRiderAccount);

router.put("/update-rider-details/:id", UpdateRiderAccount);
router.get("/profile/:id", GetRiderProfile);
// Ride approval
// on rider registering assign them to CCA for approval or add them without approval
// endpoint to update approval(whether suspended or approved, assign approver)
// On rider being approved, check on the queue whether we have riders that are pending approval

router.patch("/approval/:id", riderEdit, AssignCCAOnRiderCreation);

export default router;
