import { Queue } from "bullmq";
import { bullmqConnection } from "../lib/redis";
type imageJobData ={
    publicId:string
}
const QUEUE_NAME = 'cloudinary-image';
const DELETE_CLOUDINARY_JOB = 'delete-cloudinary-image';

export const QueueForImageJob = new Queue(QUEUE_NAME,{
    connection:bullmqConnection
})

export async function deleteImageJob(publicId: string): Promise<void> {
    const jobData:imageJobData = {
        publicId
    }
    // add one job to queue
    await QueueForImageJob.add(DELETE_CLOUDINARY_JOB,jobData,{
        attempts:3,
        backoff:{
            type:'exponential',
            delay:3000
        },
        removeOnComplete:true,
        removeOnFail:false
    })
}
