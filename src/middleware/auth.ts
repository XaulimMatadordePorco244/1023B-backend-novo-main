import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AutenticacaoRequest extends Request {
    usuarioId?: string
}

function auth(req: AutenticacaoRequest, res: Response, next: NextFunction){
    console.log('Cheguei no middleware e fui bloqueado')
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if(!authHeader) return res.status(401).json({mensagem:'Você não passou o token'})

    const token = authHeader.split(' ')[1]!
    
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if(err){ 
            console.log(err)    
             return res.status(401).json({mensagem:'Token inválido'})
        }
        if(typeof decoded === 'string' || !decoded || !("usuarioId" in decoded)){
            return res.status(401).json({mensagem:'Token inválido'})
        }
        req.usuarioId = decoded.usuarioId
        next()
    })
}



export default auth