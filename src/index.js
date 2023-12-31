// Import required modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routerUsuario from "./routes/usuarioRouter.js";
import routerConcursos from "./routes/concursoRouter.js";
import routerCriterios from "./routes/criteriosRouter.js";
import routerPonderacion from "./routes/ponderacionController.js";
import routerConcursantes from "./routes/concursantesRouter.js";

import { prisma } from "./db/prisma.js";
dotenv.config();

// Create an instance of the Express application
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routerUsuario);
app.use("/concursos", routerConcursos);
app.use("/criterios", routerCriterios);
app.use("/ponderaciones", routerPonderacion);
app.use("/concursantes", routerConcursantes);

// Start the server
const port = 4000; // You can change this to any available port

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

(async () => {
  try {
    const hayUsuario = await prisma.usuario.findFirst({
      where: { rol: "admin" },
    });
    if (!hayUsuario) {
      await prisma.usuario.create({
        data: {
          nombre: "Admin",
          usuario: "123",
          password: "123",
          rol: "admin",
        },
      });
      console.log("Admin Creado !");
    }
  } catch (error) {
    console.log(error);
  }
})();
