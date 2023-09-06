import z from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";

const loginSchema = z.object({
  usuario: z.string(),
  password: z.string(),
});

const createJuradoSchema = z.object({
  nombre: z.string(),
  usuario: z.string(),
  password: z.string(),
});

const updateJuradoSchema = createJuradoSchema.partial();

export const login = async (req, res) => {
  try {
    const { usuario, password } = loginSchema.parse(req.body);

    const user = await prisma.usuario.findFirst({
      where: { usuario },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return res.json({
      id: user.id,
      nombre: user.nombre,
      usuario: user.usuario,
      rol: user.rol,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const crearJurado = async (req, res) => {
  try {
    const { nombre, usuario, password } = createJuradoSchema.parse(req.body);
    const rol = req.query.rol || "jurado";


    //Si existe con el mismo usuario
    const mismoUsuario = await prisma.usuario.findFirst({
      where: {
        usuario
      }
    })

    if(mismoUsuario) return res.status(400).json({msg: "Mismo usuario !"})

    // Create jurado user
    const createdJurado = await prisma.usuario.create({
      data: {
        nombre,
        usuario,
        password,
        rol,
      },
    });

    return res.json(createdJurado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const obtenerJurados = async (req, res) => {
  const rol = req.query.rol || "";
  let prismaQuery = {};

  if (rol) {
    prismaQuery = { where: { rol } };
  } else {
    prismaQuery = { where: { rol: { in: ["encargado", "jurado"] } } };
  }

  try {
    const jurados = await prisma.usuario.findMany(prismaQuery);
    return res.json(jurados);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const actualizarJurado = async (req, res) => {
  const juradoId = req.params.id;
  try {
    const { nombre, usuario, password } = updateJuradoSchema.parse(req.body);
    
    //Si existe con el mismo usuario
    const mismoUsuario = await prisma.usuario.findFirst({
      where: {
        usuario,
        NOT: {
          id: juradoId
        }
      }
    })

    if(mismoUsuario) return res.status(400).json({msg: "Mismo usuario !"})

    const updatedJurado = await prisma.usuario.update({
      where: { id: juradoId },
      data: { nombre, usuario, password },
    });

    return res.json(updatedJurado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const obtenerUnJurado = async (req, res) => {
  const juradoId = req.params.id;
  try {
    const jurado = await prisma.usuario.findFirst({
      where: { id: juradoId },
    });

    return res.json(jurado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const eliminarJurado = async (req, res) => {
  const juradoId = req.params.id;
  try {
    const deletedJurado = await prisma.usuario.delete({
      where: { id: juradoId },
    });

    return res.json(deletedJurado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
