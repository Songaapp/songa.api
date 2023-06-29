import express, { Router, Request, Response } from 'express';
import { CreateUserAccount, DeleteUserAccount, GetUserProfile, LoginUser, UpdateUserDetails } from '../controllers/UserControllers';

const router: Router =express.Router();

const ser={
    "name": "Martin",
    "age": "23"
}
router.post("/create-user-account", CreateUserAccount)
router.post("/login-user", LoginUser)
router.post("/delete-user-account/:id", DeleteUserAccount)
router.put("/update-user-account/:id", UpdateUserDetails)
router.get("/profile/:id",GetUserProfile)
router.get("/users",(req: Request, res:Response)=>{
    res.json(ser)
})

export default router;