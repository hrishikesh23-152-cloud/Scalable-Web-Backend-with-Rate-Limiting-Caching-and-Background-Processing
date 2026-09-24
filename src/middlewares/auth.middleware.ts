import { Response,Request,NextFunction } from "express";
import { Apperror } from "../errors/Apperror";
import {verifyAccessToken} from "../lib/jwt"


export function authMiddle(
    req:Request,
    _res:Response,
    next:NextFunction
):void{
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith('Bearer ')){
        throw new Apperror(401,"Access token is not present in header")
    }
    const token = authHeader.split(" ")[1];
    req.user = verifyAccessToken(token)
    next();
}