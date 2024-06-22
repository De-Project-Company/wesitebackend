import { Router } from "express";
import { sayHelloController } from "../controllers";
import {
  Register,
  VerifyOtp,
  getAllUsers,
  getMemberById,
  upDateRegistraion,
  getPublication,
} from "../controllers/members.cnt";
import { GetAllPrroject, getProjectbyId } from "../controllers/projrct.cnt";

const router = Router();
const memberRoute = Router();
const proRoute = Router();

router.get("/", sayHelloController);

// member routes
memberRoute.post("/register", Register);
memberRoute.post("/verify-otp", VerifyOtp);
memberRoute.get("/get-all-users", getAllUsers);
memberRoute.get("/get-member-by-id?:id", getMemberById);
memberRoute.post("/update-registraion?:id", upDateRegistraion);

// project routes
proRoute.get("/project", GetAllPrroject);
proRoute.get("/get-project-by-id?:id", getProjectbyId);

// publications routes
proRoute.get("/publication", getPublication);

export { router, memberRoute, proRoute };
