import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  actualizarCriterio,
  crearCriterio,
  duplicarCriterio,
  eliminarCriterio,
  obtenerCriterioPorId,
  obtenerCriterios,
} from "../controller/criteriosController.js";

const router = Router();

router.post("/", auth, admin, crearCriterio);
router.get("/", auth, admin, obtenerCriterios);
router.get("/duplicar/:id", auth, admin, duplicarCriterio)
router.get("/:id", auth, admin, obtenerCriterioPorId);
router.put("/:id", auth, admin, actualizarCriterio);
router.delete("/:id", auth, admin, eliminarCriterio);


export default router;
