import { Router } from "express";
import { signin, Signup } from "../controllers/auth.controller";

const router = Router();
router.post("/signup", Signup);
router.post("/signin", signin);
export default router;