import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  actualizarPonderacion,
  crearPonderacion,
  eliminarPonderacion,
  obtenerPonderacionPorId,
  obtenerPonderaciones,
} from "../controller/ponderacionController.js";

const router = Router();

router.post("/", auth, admin, crearPonderacion);
router.get("/", auth, admin, obtenerPonderaciones);
router.get("/:id", auth, admin, obtenerPonderacionPorId);
router.put("/:id", auth, admin, actualizarPonderacion);
router.delete("/:id", auth, admin, eliminarPonderacion);

export default router;
