import {createClient} from 'redis';
import { env } from '../config/env';
import { logger } from '../lib/logger';

const redisUrl = env.redis_url;

export const redisClient = createClient({
    url:redisUrl
});

redisClient.on("connect",()=>{
    console.log("Reis client connected");
})
redisClient.on("ready",()=>{
    console.log("Reis client is ready");
})
redisClient.on("error",(error)=>{
    console.log("Reis client error",error);
})
redisClient.on("end",()=>{
    console.log("Reis client end");
})

export async function connectRedis():Promise<void>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
    const pong = await redisClient.ping();
    console.log('redis ping',pong);
}
export async function disconnectRedis():Promise<void>{
    if(redisClient.isOpen){
       
        await redisClient.quit()
    }
}

