import jwt from "jsonwebtoken"
import { prisma } from "../db/prisma.js";

export const auth = async (req,res,next)=>{
    try {
        let token = req.headers.authorization;
        if(!token) return res.status(400).json({message: "No hay token"})
        
        if(!token.startsWith("Bearer")) return res.status(400).json({message: "Token no valido"})
   
        token = token.split(" ")[1];

        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        const usuario = await prisma.usuario.findFirst({where: {id}})

        if(!usuario) return res.status(400).json({message: "token invalido"})

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "No hay token"})
    }
}