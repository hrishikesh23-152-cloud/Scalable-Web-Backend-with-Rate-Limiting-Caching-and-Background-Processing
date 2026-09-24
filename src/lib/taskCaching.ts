import { Task } from "../types/task";
import { logger } from "./logger";
import { redis } from "./redis";

const REDIS_TASK_KEY = 'admin:task'
const REDIS_EXP_SEC = 60;

export async function getTasksFromCache():Promise<Task[] | null>{
    logger.info("Trying to get tasks from redis...")
    const cacheData = await redis.get(REDIS_TASK_KEY);

    if(!cacheData){
        return null;
    }
    logger.info("successfully get tasks from redis")
    return JSON.parse(cacheData) as Task[] ;
}

export async function setTasksFromCache(data:Task[]):Promise<void>{
    logger.info("Trying to set tasks to redis...")
    await redis.set(REDIS_TASK_KEY,JSON.stringify(data),'EX',REDIS_EXP_SEC  );

}

export async function clearTasksFromCache():Promise<void>{
    logger.info("Trying to delete tasks from redis...")
    await redis.del(REDIS_TASK_KEY)
}