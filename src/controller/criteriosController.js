import { prisma } from "../db/prisma.js";
import z from "zod";

const criterioSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  id_concurso: z.string(),
});

// Crear un criterio
export const crearCriterio = async (req, res) => {
  try {

    if (req.body.criterios) {
      const data = req.body.criterios.map((criterio) =>
        criterioSchema.parse(criterio)
      );

      const criterios = await prisma.criterio.createMany({
        data,
      });

      return res.json(criterios);
    }

    const data = criterioSchema.parse(req.body);

    const criterio = await prisma.criterio.create({
      data,
    });

    return res.json(criterio);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al crear el criterio.", error });
  }
};

// Obtener todos los criterios
export const obtenerCriterios = async (req, res) => {
  try {
    const criterios = await prisma.criterio.findMany({
      include: {
        ponderaciones: true,
      }
    });

    return res.json(criterios);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener los criterios.", error });
  }
};

// Obtener un criterio por ID
export const obtenerCriterioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const criterio = await prisma.criterio.findUnique({
      where: { id },
      include: {
        ponderaciones: true,
      }
    });

    if (!criterio) {
      return res.status(404).json({ message: "Criterio no encontrado." });
    }

    return res.json(criterio);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener el criterio.", error });
  }
};

// Actualizar un criterio por ID
export const actualizarCriterio = async (req, res) => {
  const { id } = req.params;
  const data = criterioSchema.partial().parse(req.body);

  try {
    const criterio = await prisma.criterio.update({
      where: { id },
      data,
    });

    return res.json(criterio);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al actualizar el criterio.", error });
  }
};

// Eliminar un criterio por ID
export const eliminarCriterio = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.criterio.delete({
      where: { id },
    });

    return res.json({ message: "Criterio eliminado exitosamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Hubo un error al eliminar el criterio.", error });
  }
};
