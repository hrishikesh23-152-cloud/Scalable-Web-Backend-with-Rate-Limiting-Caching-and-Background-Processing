
import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";
import { Apperror } from "../errors/Apperror";

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;


export async function RateLimitMiddleWare(req:Request,res:Response,next:NextFunction){
   try {
     const ip = req.ip;
    const key = `rate-limit-${ip}`;

    const ReqCount = await redis.incr(key);

    if(ReqCount === 1){
        await redis.expire(key,RATE_LIMIT_WINDOW);
    }

    if(ReqCount > RATE_LIMIT_MAX_REQUESTS){
        return res.status(429).json({ error: "Too many requests" });
    }

    next();
   } catch (error) {
    throw new Apperror(500,'Rate limit middleware error');
   }
}