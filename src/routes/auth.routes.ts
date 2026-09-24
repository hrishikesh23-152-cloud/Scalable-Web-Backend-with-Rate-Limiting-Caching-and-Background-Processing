import { NextFunction, Router } from "express";
import { Request,Response } from "express";
import {registerUser} from '../services/auth.service';
import {loginUser,googleLogin} from '../services/auth.service'
import { authMiddle } from "../middlewares/auth.middleware";
import { RateLimitMiddleWare as rateLimitMiddleWare } from "../middlewares/rateLimiting";
export const AuthRouter = Router();
AuthRouter.use(rateLimitMiddleWare);
AuthRouter.post('/register', async (req:Request,_res:Response,next:NextFunction)=>{
    

    try {
        const {email,password} = req.body;
        await registerUser(email,password);
    _res.status(201).json({
        success:true,
        message:"Registration successfull"
    })
    } catch (error) {
        next(error)
    }
});

AuthRouter.post('/login',async (req:Request,_res:Response,next:NextFunction)=>{
    
    try {
        const {email,password} = req.body;
        const {accessToken} = await loginUser(email,password);
    _res.status(200).json({
        success:true,
        message:"login successfull",
        data:accessToken
    })
    } catch (error) {
        next(error)
    }
})


AuthRouter.get('/me',authMiddle,(req:Request,_res:Response)=>{
    _res.status(200).json({
        success:true,
        data:{
            userId:req.user.userId,
            email:req.user.email,
            role:req.user.role
        }
    })
})

AuthRouter.get('/google',  (req:Request,_res:Response,next:NextFunction)=>{
    const googleUrl = googleLogin();
    _res.redirect(googleUrl)
})


AuthRouter.get('/google/callback', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const code = req.query.code as string | undefined;
        
    } catch (error) {
        
    }
})