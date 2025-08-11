import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { saveUser, getUser, loginUser, getResidentes, createResidente, deactivateResidente, assignUsuario, assignControl, assignResidencia, getReservaciones, crearReservacion, cancelarReservacion, marcarRealizada, getResidentsEntrada, createResidentEntrada, getResidentsSalida, createResidentSalida, getAllUIDs, saveSensorData, getSensorData, getUserById, updateUser, } from "../controllers/auth.controller";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


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
router.get("/residentes", getResidentes);
router.get('/residentes', getResidentes);
router.post('/residentes', createResidente);
router.put('/residentes/:id/deactivate', deactivateResidente);
router.put('/residentes/:id/usuario', assignUsuario);
router.put("/residentes/:id/control", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await assignControl(req, res);
  } catch (error) {
    next(error);
  }
});
router.put('/residentes/:id/residencia', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await assignResidencia(req, res);
  } catch (error) {
    next(error);
  }
});
export default router;  
router.get("/reservaciones", getReservaciones);
router.post("/reservaciones", crearReservacion);
router.put("/reservaciones/:id/cancelar", cancelarReservacion);
router.put("/reservaciones/:id/realizada", marcarRealizada);

router.get("/residentes-entrada", getResidentsEntrada);
router.post("/residentes-entrada", createResidentEntrada);
router.get("/residentes-salida", getResidentsSalida);
router.post("/residentes-salida", createResidentSalida);
router.get("/residentes-uids", getAllUIDs);

router.post('/sensores', saveSensorData);
router.get('/sensores', getSensorData);

router.put('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateUser(req, res);
  } catch (error) {
    next(error);
  }
});
router.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await  getUserById(req, res);
  } catch (error) {
    next(error);
  }
});

