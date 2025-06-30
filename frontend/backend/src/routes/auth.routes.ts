import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { saveUser, getUser, loginUser, getSettings, saveSettings, saveResidente, getResidentes, getDashboardData } from "../controllers/auth.controller";


router.post("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saveUser(req, res);
  } catch (error) {
    next(error);
  }
});
router.get("/users", getUser);
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    next(error);
  }
});
router.post("/settings", saveSettings);
router.get("/settings", getSettings);
router.post("/residentes", saveResidente);
router.get("/residentes", getResidentes);
router.get("/dashboard", getDashboardData);


export default router;  