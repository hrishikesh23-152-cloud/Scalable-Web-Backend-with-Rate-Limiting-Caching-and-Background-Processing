import multer from 'multer';
import { Apperror } from '../errors/Apperror';


const MAX_FILE_SIZE = 10*1024*1024;


export const bannerMiddleware = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:MAX_FILE_SIZE
    },
    fileFilter:(_req,file,callback)=>{
        if(!file.mimetype.startsWith('image/')){
            callback(new Apperror(400,"only image is allowed to uplaod"))
            return;
        }
        callback(null,true);
    }
})

export const uplaodSingleImage = bannerMiddleware.single("image");