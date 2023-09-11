import { Router } from "express";
import { actualizarConcurso, agregarJuradoConcurso, cambiarEstado, crearConcurso, eliminarConcurso, eliminarJuradoConcurso, enviarResultados, importarCriterios, obtenerConcursantesConcurso, obtenerConcursantesDisponibles, obtenerConcursoPorId, obtenerConcursos, obtenerJuradosConcurso, obtenerJuradosConcursoDisponible, obtenerRanking, obtenerResultadosEvaluacion, resetearEvaluaciones } from "../controller/concursoController.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = Router();

router.post("/",auth, admin, crearConcurso);
router.get("/",auth,  obtenerConcursos);

router.delete("/resetear/:id", auth, resetearEvaluaciones)
router.post("/importar-rubrica/:id", auth, importarCriterios)
router.patch("/estado/:id", auth, cambiarEstado)
router.get("/jurados/:id", auth, obtenerJuradosConcurso)
router.get("/jurados/disponible/:id", auth, obtenerJuradosConcursoDisponible)
router.post("/jurados/:id/:id_jurado", auth, agregarJuradoConcurso)
router.delete("/jurados/:id/:id_jurado", auth, eliminarJuradoConcurso)


router.get("/ranking/:id", auth, obtenerRanking)
router.post("/enviar-resultados/:id", auth, enviarResultados);
router.post("/resultados/:id", auth, obtenerResultadosEvaluacion);

router.get("/concursantes/:id",auth, obtenerConcursantesConcurso);
router.get("/concursantes/disponible/:id", auth, obtenerConcursantesDisponibles);

router.get("/:id",auth,  obtenerConcursoPorId);
router.put("/:id",auth, admin, actualizarConcurso);
router.delete("/:id",auth, admin, eliminarConcurso);

export default router;