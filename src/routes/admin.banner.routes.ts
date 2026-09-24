import { NextFunction, Router } from "express";
import { Request,Response } from "express";
import { authMiddle } from "../middlewares/auth.middleware";
import { adminMiddle } from "../middlewares/admin.middleware";
import { UploadBannerToCloudinary } from "../services/admin.banner.service";
import { uplaodSingleImage } from "../middlewares/banner.middleware";
import { GetAllCloudinaryLink,DeleteImage } from "../services/admin.banner.service";
import { RateLimitMiddleWare } from "../middlewares/rateLimiting";

export const AdminBannerRouter = Router();
AdminBannerRouter.use(authMiddle,adminMiddle,RateLimitMiddleWare)
AdminBannerRouter.post('/',uplaodSingleImage , async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const banner = await UploadBannerToCloudinary(req.file);

        return _res.status(201).json({
            uploaded:"✅",
            data:{banner}
        })
    } catch (error) {
        next(error)
    }
})
AdminBannerRouter.get('/', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const result = await GetAllCloudinaryLink();
        return _res.status(200).json({
            success:true,
            data:result
        })
    } catch (error) {
        next(error);
    }
})
AdminBannerRouter.delete('/:publicId', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const {publicId} = req.params;
        await DeleteImage(String(publicId));
        return _res.status(200).json({
            success:true,
            message:"Banner deleted successfully"
        })
    } catch (error) {
        next(error)
    }
})