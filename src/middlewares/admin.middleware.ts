import { Response,Request,NextFunction } from "express";
import { Apperror } from "../errors/Apperror";
import {verifyAccessToken} from "../lib/jwt"


export function adminMiddle(
    req:Request,
    _res:Response,
    next:NextFunction
):void{
   if(req.user?.role!=='ADMIN'){
    next(new Apperror(403,"You are not an admin"))
    return ;
   }
   next()
}