import { Banner } from "../types/banner";
import { logger } from "./logger";
import { redis } from "./redis";


export const ADMIN_BANNERS_CACHE_KEY = "admin:banners";
const ADMIN_BANNERS_TTL = 60


export async function getBannersFromCache():Promise<Banner[] | null>{
    logger.info("Trying to get info from redis...")
    const cacheData = await redis.get(ADMIN_BANNERS_CACHE_KEY);

    if(!cacheData){
        return null;
    }
    logger.info("successfully get info from redis")
    return JSON.parse(cacheData) as Banner[] ;
}

export async function setBannersFromCache(data:Banner[]):Promise<void>{
    logger.info("Trying to set info to redis...")
    await redis.set(ADMIN_BANNERS_CACHE_KEY,JSON.stringify(data),'EX',ADMIN_BANNERS_TTL );

}

export async function clearBannerFromCache():Promise<void>{
    logger.info("Trying to delete info from redis...")
    await redis.del(ADMIN_BANNERS_CACHE_KEY)
}