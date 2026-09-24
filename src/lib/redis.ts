import Redis from "ioredis";
import { env } from "../config/env";

const rurl = String(env.redis_url);

export const redis = new Redis(rurl);
const redisUrl = new URL(rurl);
export const bullmqConnection = {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port),
    maxRetriesPerRequest: null,
}