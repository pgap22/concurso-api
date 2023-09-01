import { prisma } from "../db/prisma.js";
import z from "zod";

const ponderacionSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  valor: z.number(),
  id_criterio: z.string(),
});

// Crear una ponderación para un criterio
export const crearPonderacion = async (req, res) => {
  try {
    const data = ponderacionSchema.parse(req.body);
    const ponderacion = await prisma.ponderacionCriterio.create({
      data,
    });
    return res.json(ponderacion);
  } catch (error) {
    return res.status(400).json({ message: "Hubo un error al crear la ponderación.", error });
  }
};

// Obtener todas las ponderaciones
export const obtenerPonderaciones = async (req, res) => {
  try {
    const ponderaciones = await prisma.ponderacionCriterio.findMany();
    return res.json(ponderaciones);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error al obtener las ponderaciones.", error });
  }
};

// Obtener una ponderación por ID
export const obtenerPonderacionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const ponderacion = await prisma.ponderacionCriterio.findUnique({
      where: { id },
    });
    if (!ponderacion) {
      return res.status(404).json({ message: "Ponderación no encontrada." });
    }
    return res.json(ponderacion);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error al obtener la ponderación.", error });
  }
};

// Actualizar una ponderación por ID
export const actualizarPonderacion = async (req, res) => {
  const { id } = req.params;
  try {
    const data = ponderacionSchema.parse(req.body);
    const ponderacion = await prisma.ponderacionCriterio.update({
      where: { id },
      data,
    });
    return res.json(ponderacion);
  } catch (error) {
    return res.status(400).json({ message: "Hubo un error al actualizar la ponderación.", error });
  }
};

// Eliminar una ponderación por ID
export const eliminarPonderacion = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.ponderacionCriterio.delete({
      where: { id },
    });
    return res.json({ message: "Ponderación eliminada exitosamente." });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error al eliminar la ponderación.", error });
  }
};
