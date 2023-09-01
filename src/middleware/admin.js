export const admin = async (req,res,next) => { 
    if(req.usuario.rol=="admin" || req.usuario.rol=="encargado") return next();

    return res.status(400).json({msg: "Not logged !"})
}