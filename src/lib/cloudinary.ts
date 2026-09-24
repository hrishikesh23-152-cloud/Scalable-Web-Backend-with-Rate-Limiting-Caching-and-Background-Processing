import cloudinary, { UploadStream } from 'cloudinary';
import { env } from '../config/env';
import { Apperror } from '../errors/Apperror';
import { resolve } from 'node:dns';

type uploadPayload = {
    secureUrl:string,
    publicUrl:string
}

export async function uplaodimageToCloudinary(
    buffer:Buffer,
    options?:{
        folder?:string
    }
):Promise<uploadPayload>{
    const cloudName = env.cloudinary_name;
    const apiKey = env.cloudinary_api_key;
    const secret = env.cloudinary_api_secret;
    if(!cloudName || !apiKey || !secret){
        throw new Apperror(500,'Cloudinary configuration error');
    }
    cloudinary.v2.config({
        cloud_name:cloudName,
        api_key:apiKey,
        api_secret:secret
    });

    return new Promise((resolve,reject)=>{
        const uplaodBuffer = cloudinary.v2.uploader.upload_stream(
            {
                resource_type:'image',
                folder:options?.folder
            },
            (error,result)=>{
                if(error){
                    reject(error)
                    return;
                }
                resolve({
                    secureUrl:result?.secure_url ?? "",
                    publicUrl:result?.public_id ?? ""
                })
            }
        )
        uplaodBuffer.end(buffer)
    })
}

export async function deleteImageFromCloudinary(
    publicId:string
):Promise<void>{
    const cloudName = env.cloudinary_name;
    const apiKey = env.cloudinary_api_key;
    const secret = env.cloudinary_api_secret;
    if(!cloudName || !apiKey || !secret){
        throw new Apperror(500,'Cloudinary configuration error');
    }
    cloudinary.v2.config({
        cloud_name:cloudName,
        api_key:apiKey,
        api_secret:secret
    });
    const result = await cloudinary.v2.uploader.destroy(publicId)

    if(result.result !== 'ok'){
        throw new Apperror(500,'Failed to delete image from cloudinary');
    }
    return result;
}