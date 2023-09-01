import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  actualizarJurado,
  crearJurado,
  eliminarJurado,
  login,
  obtenerJurados,
  obtenerUnJurado,
} from "../controller/usuarioController.js";

const router = Router();

router.post("/login", login);
router.get("/perfil", auth, (req, res) => res.json(req.usuario));
router.route("/jurados")
  .post(auth, crearJurado)
  .get(auth, obtenerJurados);

router
  .route("/jurados/:id")
  .get(auth, obtenerUnJurado)
  .patch(auth, actualizarJurado)
  .delete(auth, eliminarJurado);

export default router;
