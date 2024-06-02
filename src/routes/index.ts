import { Router } from "express";
import { sayHelloController } from "../controllers";
import { Register, VerifyOtp } from "../controllers/members.cnt";

const router = Router();
const memberRoute = Router();

router.get("/", sayHelloController);

// member routes
memberRoute.post("/register", Register);
memberRoute.post("/verify-otp", VerifyOtp);

export { router, memberRoute };
