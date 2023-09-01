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
import { Prisma } from "@prisma/client";
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
          usuario: "admin_creaj",
          password: "admin_creaj_2023",
          rol: "admin",
        },
      });
      console.log("Admin Creado !");
    }
  } catch (error) {
    console.log(error);
  }
})();

(async () => {


  // let id_concurso = datos[0].id_concurso;

  // //Eliminar Rubrica
  // await prisma.criterio.deleteMany({
  //   where: {
  //     id_concurso,
  //   },
  // });

  //Crear Criterios

  // await prisma.$queryRaw`INSERT INTO criterio(id,nombre,descripcion,id_concurso) VALUES ${Prisma.join(
  //   datos.map(
  //     (row) =>
  //       Prisma.sql`(uuid(),${row.nombre}, ${row.descripcion}, ${row.id_concurso})`
  //   )
  // )}`;

  // Obtner ID de los criterios Creados
  const idCriterios = await prisma.criterio.findMany({
    where: {
      id_concurso,
    },
    select: {
      id: true,
    },
  });

  const ponderacion = idCriterios
    .map(({ id }, i) => {
      return datos[i].ponderaciones.map((ponderacion) => {
        ponderacion.id_concurso = id;
        return ponderacion;
      });
    })
    .flatMap((p) => p);

  await prisma.$queryRaw`INSERT INTO ponderacioncriterio(id,nombre,valor,descripcion,id_criterio) VALUES ${Prisma.join(
    ponderacion.map(
      (row) =>
        Prisma.sql`(uuid(), ${row.nombre},${row.valor},${row.descripcion},${row.id_concurso})`
    )
  )}`;


});
