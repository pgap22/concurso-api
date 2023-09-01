import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  actualizarConcursante,
  crearConcursante,
  eliminarConcursante,
  obtenerConcursantePorId,
  obtenerConcursantes,
  obtenerConcursosDisponibles,
  removerloDelConcurso,
  unirloAConcurso,
} from "../controller/concursanteController.js";

const router = Router();

router.post("/", auth, admin, crearConcursante);
router.get("/", auth, admin, obtenerConcursantes);

router.get("/concursos-disponibles/:id", auth, obtenerConcursosDisponibles);
router.post("/unir/:id", auth, admin, unirloAConcurso);
router.post("/salir/:id", auth, admin, removerloDelConcurso);

router.get("/:id", auth, obtenerConcursantePorId);
router.put("/:id", auth, admin, actualizarConcursante);
router.delete("/:id", auth, admin, eliminarConcursante);

export default router;
