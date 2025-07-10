import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { saveUser, getUser, loginUser, getSettings, saveSettings, getResidentes, getDashboardData, createResidente, deactivateResidente, assignUsuario, assignControl } from "../controllers/auth.controller";


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
router.get("/residentes", getResidentes);
router.get("/dashboard", getDashboardData);
router.get('/residentes', getResidentes);
router.post('/residentes', createResidente);
router.put('/residentes/:id/deactivate', deactivateResidente);
router.put('/residentes/:id/usuario', assignUsuario);
router.put('/residentes/:id/control', assignControl);


export default router;  