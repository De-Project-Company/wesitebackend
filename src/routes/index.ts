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
import { getAllEvents, getEventById } from "../controllers/events";

const router = Router();
const memberRoute = Router();
const proRoute = Router();
const pubRoute = Router();
const eveRoute = Router();

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
pubRoute.get("/publication", getPublication);

// events routes
eveRoute.get("/event", getAllEvents);
eveRoute.get("/get-event-by-id?:id", getEventById);

export { router, memberRoute, proRoute, pubRoute, eveRoute };
