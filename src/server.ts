import {createApp} from './app'
import { env } from './config/env';
import { logger } from './lib/logger';
import { connectRedis, disconnectRedis } from './redis/client';


const app = createApp();

async function Server(){
    try {
        // await connectRedis();
        app.listen(env.port,()=>{
        logger.info(`server is running at http://localhost:${env.port}`)
});
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}
// process.on('SIGINT',async ()=>{
//     await disconnectRedis();
//     process.exit(1)
// });
Server();