import { Router } from "express";
import { sayHelloController } from "../controllers";
import {
  Register,
  VerifyOtp,
  getAllUsers,
  getMemberById,
} from "../controllers/members.cnt";

const router = Router();
const memberRoute = Router();

router.get("/", sayHelloController);

// member routes
memberRoute.post("/register", Register);
memberRoute.post("/verify-otp", VerifyOtp);
memberRoute.get("/get-all-users", getAllUsers);
memberRoute.get("/get-member-by-id?:id", getMemberById);

export { router, memberRoute };
