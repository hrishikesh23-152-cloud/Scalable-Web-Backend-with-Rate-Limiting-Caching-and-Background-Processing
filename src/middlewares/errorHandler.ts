import { Response,Request, NextFunction } from "express";
import { logger } from "../lib/logger";
import { Apperror } from "../errors/Apperror";


export function errorHandler(
    err:Error,
    _req:Request,
    res:Response,
    _next:NextFunction
):void {
    logger.error(`Error:${err} ${err.stack}`)
    if(err instanceof Apperror){
        res.status(err.statusCode).json({
            success:false,
            message:err.message
        })
        return 
    }
    res.status(500).json({
        success:false,
        message:'internal server error',
    })
};