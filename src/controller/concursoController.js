import z from "zod";
import { v4 as uuidv4 } from 'uuid';

import { prisma } from "../db/prisma.js";
import { Prisma } from "@prisma/client";

const concursoScheme = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  fecha: z.date().or(z.string()),
  criterios: z.array().optional(),
});

const resultados = z.object({
  id_concursante: z.string(),
  puntajes: z
    .object({
      id_criterio: z.string(),
      valor: z.number(),
    })
    .array(),
});

// Crear un concurso
export const crearConcurso = async (req, res) => {
  try {
    const data = concursoScheme.parse(req.body);

    data.id_usuario = req.usuario.id

    const concurso = await prisma.concurso.create({
      data,
    });

    return res.json(concurso);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Hubo un error al crear el concurso." });
  }
};

// Obtener todos los concursos
export const obtenerConcursos = async (req, res) => {
  try {
    let prismaQuery = {
      include: {
        criterios: {
          include: {
            ponderaciones: true,
          },
        },
        usuarioCreador: true
      },
    };

    if (req.usuario.rol == "jurado") {
      prismaQuery = {
        ...prismaQuery,
        where: {
          concursoJurados: { some: { id_jurado: { in: [req.usuario.id] } } },
        },
      };
    }

    if(req.usuario.rol == "encargado"){
      prismaQuery = {
        ...prismaQuery,
        where: {
          id_usuario: req.usuario.id
        }
      }
    }

    const concursos = await prisma.concurso.findMany(prismaQuery);

    return res.json(concursos);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener los concursos." });
  }
};

// Obtener un concurso por ID
export const obtenerConcursoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const concurso = await prisma.concurso.findUnique({
      where: { id },
      include: {
        criterios: {
          orderBy:{
            createdAt: 'asc'
          },
          include: {
            ponderaciones: {
              orderBy: {
                valor: "asc",
              },
            },
          },
        },
      },
    });

    if (!concurso) {
      return res.status(404).json({ message: "Concurso no encontrado." });
    }

    return res.json(concurso);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener el concurso." });
  }
};

// Actualizar un concurso por ID
export const actualizarConcurso = async (req, res) => {
  const { id } = req.params;
  const data = concursoScheme.partial().parse(req.body);

  try {
    const concurso = await prisma.concurso.update({
      where: { id },
      data,
    });

    return res.json(concurso);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Hubo un error al actualizar el concurso." });
  }
};

// Eliminar un concurso por ID
export const eliminarConcurso = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.concurso.delete({
      where: { id },
    });

    return res.json({ message: "Concurso eliminado exitosamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al eliminar el concurso." });
  }
};

export const obtenerConcursantesConcurso = async (req, res) => {
  try {
    const { id } = req.params;
    const concursantes = await prisma.concursanteConcurso.findMany({
      where: {
        id_concurso: id,
      },
      select: {
        concursante: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            grado: true,
            institucion: true,
            evaluaciones: {
              where: {
                id_concurso: id
              }
            }
          }
        },
      },
    });

    return res.json(concursantes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const enviarResultados = async (req, res) => {
  try {
    const id_concurso = req.params.id;
    const id_jurado = req.usuario.id;
    const datosValidados = resultados.parse(req.body);

    const { id_concursante, puntajes: puntajesConcursante } = datosValidados;

    //Checar si ya lo evaluo
    const yaEvaluo = await prisma.evaluacionConcursante.findFirst({
      where: {
        id_concursante,
        id_jurado,
        id_concurso,
      },
    });

    if (yaEvaluo) return res.status(400).json({ msg: "Ya ha sido evaluado !" });

    const puntajeTotal = puntajesConcursante.reduce(
      (total, puntaje) => total + puntaje.valor,
      0
    );

    const evaluacionConcurso = await prisma.evaluacionConcursante.create({
      data: {
        id_concursante,
        id_jurado,
        id_concurso,
        puntajeTotal,
      },
    });

    const data = puntajesConcursante.map((puntaje) => {
      puntaje.id_evaluacion = evaluacionConcurso.id;
      return puntaje;
    });

    const puntajes = await prisma.puntajeConcursante.createMany({
      data,
    });

    return res.json({ evaluacionConcurso, puntajes });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const obtenerResultadosEvaluacion = async (req, res) => {
  try {
    const id_concurso = req.params.id;
    const id_jurado = req.usuario.id;
    const { id_concursante } = z
      .object({ id_concursante: z.string() })
      .parse(req.body);

    //Checar si ya lo evaluo
    const evaluacion = await prisma.evaluacionConcursante.findFirst({
      where: {
        id_concursante,
        id_jurado,
        id_concurso,
      },
      include: {
        puntajesConcursante: {
          include: {
            ponderacionCriterio: true,
          },
        },
      },
    });

    return res.json(evaluacion);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const obtenerRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.concurso.findFirst({
      where: {
        id,
      },
      include: {
        concursantes: {
          include: {
            concursante: {
              include: {
                evaluaciones: {
                  where: {
                    id_concurso: id,
                  },
                  select: {
                    puntajeTotal: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const ranking = data.concursantes
      .map(({ concursante }) => {
        concursante.puntajeFinal = concursante.evaluaciones.reduce(
          (total, evaluacion) => total + evaluacion.puntajeTotal,
          0
        );
        delete concursante.evaluaciones;
        return concursante;
      })
      .sort((a, b) => b.puntajeFinal - a.puntajeFinal);

    return res.json(ranking);
  } catch (error) {
    return res.status(500).json(error);
    console.log(error);
  }
};

export const obtenerJuradosConcursoDisponible = async (req, res) => {
  try {
    const id = req.params.id;
    const jurados = await prisma.usuario.findMany({
      where: {
        rol: "jurado",
        concursoJurado: {
          none: {
            id_concurso: id,
          },
        },
      },
    });

    return res.json(jurados);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
export const obtenerJuradosConcurso = async (req, res) => {
  try {
    const id = req.params.id;
    const jurados = await prisma.concurso.findFirst({
      where: { id },
      select: {
        concursoJurados: {
          select: {
            jurado: true,
          },
        },
      },
    });

    return res.json(jurados.concursoJurados.map(({ jurado }) => jurado));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
export const agregarJuradoConcurso = async (req, res) => {
  try {
    const { id, id_jurado } = req.params;

    //Verificar si ya esta en el concurso
    const estaJurado = await prisma.concursoJurado.findFirst({
      where: {
        id_concurso: id,
        id_jurado,
      },
    });

    if (estaJurado)
      return res.status(400).json({ msg: "Ya esta en el concurso" });

    const juradoConcurso = await prisma.concursoJurado.create({
      data: {
        id_concurso: id,
        id_jurado,
      },
    });

    return res.json(juradoConcurso);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const eliminarJuradoConcurso = async (req, res) => {
  try {
    const { id, id_jurado } = req.params;

    await prisma.concursoJurado.deleteMany({
      where: {
        id_jurado,
        id_concurso: id,
      },
    });

    return res.json({ msg: "Jurado eliminado del concurso" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Hubo un error al eliminar el concurso" });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = z
      .object({ estado: z.enum(["inscripcion", "evaluacion", "finalizado"]) })
      .parse(req.body);

    const concurso = await prisma.concurso.update({
      where: { id },
      data: {
        estado,
      },
    });

    return res.json(concurso);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error !" });
  }
};

/*
Posiblemente codigo repetido
*/
// Obtener concursantes disponibles para un concurso
export const obtenerConcursantesDisponibles = async (req, res) => {
  try {
    const id = req.params.id;
    const concursantes = await prisma.concursante.findMany({
      where: {
        concursos: {
          none: {
            id_concurso: id,
          },
        },
      },
    });

    return res.json(concursantes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

const ponderacionSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  valor: z.number(),
});

const criterioSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  ponderaciones: z.array(ponderacionSchema),
  createdAt: z.string().transform(Date).optional()
});

const importJSONSchema = z.array(criterioSchema);

export const importarCriterios = async (req, res) => {
  try {
    const datos = importJSONSchema.parse(req.body);

    //Obtner el concurso
    let id_concurso = req.params.id;

    //Eliminar Rubrica
    await prisma.criterio.deleteMany({
      where: {
        id_concurso,
      },
    });

    //Crear Criterios
    await prisma.$queryRaw`INSERT INTO criterio(id,nombre,descripcion,id_concurso) VALUES ${Prisma.join(
      datos.map(
        (row) =>
          Prisma.sql`(${uuidv4()},${row.nombre}, ${row.descripcion}, ${id_concurso})`
      )
    )}`;

    // Obtner ID de los criterios Creados
    const idCriterios = await prisma.criterio.findMany({
      where: {
        id_concurso,
      },
      select: {
        id: true,
      },
    });

    //Obtner las ponderaciones segun los criterios
    const ponderacion = idCriterios
    .map(({ id }, i) => {
      return datos[i].ponderaciones.map((ponderacion) => {
        ponderacion.id_criterio = id;
        return ponderacion;
      });
    })
    .flatMap((ponderacion) => ponderacion);


    //Fix mysql and post
    if(process.env.SGBD=="mysql"){
        if(ponderacion.filter(row => row.id_criterio).length){
          await prisma.$queryRaw`INSERT INTO ponderacionCriterio(id,nombre,valor,descripcion,id_criterio) VALUES ${Prisma.join(
            ponderacion.map(
              (row) => Prisma.sql`(${uuidv4()},${row.nombre},${row.valor},${row.descripcion},${row.id_criterio})`
            )
          )}`;
        }
    }else{

      if(ponderacion.filter(row => row.id_criterio).length){
        await prisma.$queryRaw`INSERT INTO "ponderacionCriterio"(id,nombre,valor,descripcion,id_criterio) VALUES ${Prisma.join(
          ponderacion.map(
            (row) => Prisma.sql`(${uuidv4()},${row.nombre},${row.valor},${row.descripcion},${row.id_criterio})`
          )
        )}`;
      }

    }

    //Agregar las ponderaciones
 
  
    return res.json({msg: "Importado !"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg: "Error en el servidor"})
  }
};
