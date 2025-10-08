import { NextFunction, Request, Response } from "express";
function auth(req: Request, res: Response, next: NextFunction){
    console.log('Passei pelo meu middleware')
    next()
}

export { auth }