import { Response,Request, NextFunction } from "express";
import { logger } from "../lib/logger";

export function notFound(
    _req:Request,
    res:Response
):void {
    // logger.error(`Error:${err}`)

    res.status(404).json({
        success:false,
        message:'Route not found'
    })
};