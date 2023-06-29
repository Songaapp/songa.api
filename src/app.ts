import express, {Express, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import UserAuthRoutes from "./routes/userAuthRoutes";
import CustomerCareAgentRoutes from "./routes/customerCareAgentAuthRoutes";
import RiderAuthRoutes from "./routes/RiderAuthRoutes";
import RiderProfileRoutes from './routes/RiderProfileRoutes'
import mpesaRoutes from "./routes/mpesaRoutes";

import UserOTPRoutes from './routes/userOTPRoutes'

const app: Express = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors());
//routes


app.use("/api/users/auth", UserAuthRoutes);
app.use("/api/riders/auth", RiderAuthRoutes);
app.use("/api/riders/profile/", RiderProfileRoutes);
app.use("/api/points", mpesaRoutes);
app.use("/api/users/auth/OTP", UserOTPRoutes);
app.use("/api/users/customer_agent", CustomerCareAgentRoutes);
app.get("/api/", (req: Request, res: Response) => {
    res.send("test route...");
});

export default app;
