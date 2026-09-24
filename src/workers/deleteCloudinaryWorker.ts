import { Worker } from "bullmq";
import { deleteImageFromCloudinary } from "../lib/cloudinary";
import { bullmqConnection } from "../lib/redis";
import { logger } from "../lib/logger";


const DELETE_CLOUDINARY_JOB = 'delete-cloudinary-image';
const QUEUE_NAME = 'cloudinary-image';

type imageJobData ={
    publicId:string
}

export const deleteCloudinaryimageWorker = new Worker(
    QUEUE_NAME,
    async (job) => {
        if(job.name !== DELETE_CLOUDINARY_JOB){
            return ;
        }
        const data = job.data as imageJobData;
        await deleteImageFromCloudinary(data.publicId);
    },{
        connection:bullmqConnection
    }
)

deleteCloudinaryimageWorker.on('completed',(job)=>{
    logger.info(`Job ${job.id} completed successfully`);
})
deleteCloudinaryimageWorker.on('failed',(job,err)=>{
    logger.error(`Job ${job?.id} failed with error: ${err.message}`);
})
logger.info('Delete cloudinary image worker started');