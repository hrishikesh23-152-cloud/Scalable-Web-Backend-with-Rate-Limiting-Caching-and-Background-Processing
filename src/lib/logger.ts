import pino from "pino";
import {env} from '../config/env'
export const logger = pino({
    level:env.Level,
    transport:env.isProduction ? undefined 
    : {
        target:"pino-pretty",
        options:{
            colorize:true,
            translateTime:"Sys:standard"
        },
    },
});