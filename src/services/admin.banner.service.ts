import { Apperror } from '../errors/Apperror'
import { uplaodimageToCloudinary } from '../lib/cloudinary'
import {Banner} from '../types/banner'
import { InsertBannerIntoDb ,GetAllUrl, DeleteBannerFromDb} from '../repositories/admin.banner.repository'
import { clearBannerFromCache, getBannersFromCache, setBannersFromCache } from '../lib/bannerCache'
import {deleteImageJob} from '../queues/deleteImage.queue'
export async function UploadBannerToCloudinary(
    file:Express.Multer.File | undefined
):Promise<Banner>{
    if(!file){
        throw new Apperror(404,'File is required')
    }
    if(!file.buffer){
        throw new Apperror(400,'Invalid image type')
    }
    const {  secureUrl,publicUrl} = await uplaodimageToCloudinary(
        file.buffer,
        {
            folder:'Microservice-project'
        }
    )
    if(!secureUrl || !publicUrl){
        throw new Apperror(500,'Cloudinary error')
    }
    const banner = await InsertBannerIntoDb(secureUrl,publicUrl);
    if(banner===null){
        throw new Apperror(400,'Failed to uplaod to cloudinary')
    }
    await clearBannerFromCache();
    return banner;
}
export async function  GetAllCloudinaryLink():Promise<Banner[]>{
    const redis_Result = await getBannersFromCache();
    if(redis_Result!==null){
        return redis_Result;
    }
    const result = await GetAllUrl();
   
    if(result.length===0){
        throw new Apperror(404,'URL not found');
    }
     await setBannersFromCache(result);
    return result;
}

export async function DeleteImage(
    publicId:string
):Promise<void>{
    const bannerId = await DeleteBannerFromDb(publicId);
    if(!bannerId){
        throw new Apperror(404,'Banner not found');
    }
    await clearBannerFromCache();
    await deleteImageJob(bannerId);
}