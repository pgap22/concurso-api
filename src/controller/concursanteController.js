import { prisma } from "../db/prisma.js";
import z from "zod";

const concursanteScheme = z.object({
  nombres: z.string(),
  apellidos: z.string(),
  grado: z.string(),
  institucion: z.string()
});

const unirConcurso = z.object({
  id_concurso: z.string(),
});

// Crear un concursante
export const crearConcursante = async (req, res) => {
  try {
    const data = concursanteScheme.parse(req.body);
    const concursante = await prisma.concursante.create({
      data,
    });
    return res.json(concursante);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

// Obtener todos los concursantes
export const obtenerConcursantes = async (req, res) => {
  try {
    const concursantes = await prisma.concursante.findMany();
    return res.json(concursantes.reverse());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

// Obtener un concursante por ID
export const obtenerConcursantePorId = async (req, res) => {
  const { id } = req.params;
  const { concurso } = req.query;

  let concursosInclude = {};

  if (+concurso) {
    concursosInclude = {
      concursos: {
        include: {
          concurso: true,
        },
      },
    };
  }

  try {
    const concursante = await prisma.concursante.findUnique({
      where: { id },
      include: concursosInclude,
    });
    if (!concursante) {
      return res.status(404).json({ msg: "Concursante no encontrado" });
    }
    return res.json(concursante);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

// Actualizar un concursante por ID
export const actualizarConcursante = async (req, res) => {
  try {
    const { id } = req.params;
    const data = concursanteScheme.parse(req.body);
    const concursante = await prisma.concursante.update({
      where: { id },
      data,
    });
    return res.json(concursante);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

// Eliminar un concursante por ID
export const eliminarConcursante = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.concursante.delete({
      where: { id },
    });
    return res.json({ msg: "Concursante eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

export const unirloAConcurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_concurso } = unirConcurso.parse(req.body);
    const estaEnConcurso = await prisma.concursanteConcurso.findFirst({
      where: {
        id_concurso,
        id_concursante: id,
      },
    });

    if (estaEnConcurso)
      return res.status(400).json({ msg: "Ya esta inscrito !" });

    const concursoInscrito = await prisma.concursanteConcurso.create({
      data: {
        id_concursante: id,
        id_concurso,
      },
    });

    return res.status(200).json(concursoInscrito);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

export const removerloDelConcurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_concurso } = unirConcurso.parse(req.body);

    await prisma.concursanteConcurso.deleteMany({
      where: {
        id_concursante: id,
        id_concurso,
      },
    });

    return res.json({ msg: "Se ha removido del concurso !" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

export const obtenerConcursosDisponibles = async (req, res) => {
  try {
    const { id } = req.params;
    const concursosID = await prisma.concursanteConcurso.findMany({
      where: {
        id_concursante: id,
      },
      select: {
        id_concurso: true,
      },
    });

    const concursos = await prisma.concurso.findMany({
      where: {
        NOT: {
          id: {
            in: concursosID.map((id) => id.id_concurso),
          },
        },
      },
    });

    return res.json(concursos);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
