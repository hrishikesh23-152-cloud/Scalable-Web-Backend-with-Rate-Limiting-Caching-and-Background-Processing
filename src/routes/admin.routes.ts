import { NextFunction, Router } from "express";
import { Request,Response } from "express";
import { authMiddle } from "../middlewares/auth.middleware";
import { adminMiddle } from "../middlewares/admin.middleware";
import {getAdminTasks,UpdateTasks} from '../services/admin.service'
import { AdminTasks } from "../types/admin";
import { RateLimitMiddleWare } from "../middlewares/rateLimiting";


export const AdminRouter = Router();

AdminRouter.use(authMiddle,adminMiddle,RateLimitMiddleWare);

AdminRouter.post('/tasks', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const {search,status} = req.body;
        const input:AdminTasks = {
            search:search,
            status:status
        }
        const result = await getAdminTasks(input)
        return _res.status(200).json({
            success:true,
            data:result
        })
    } catch (error) {
        next(error);
    }
})

AdminRouter.patch('/tasks/:taskId', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
         const {status} = req.body;
         const taskId = String(req.params.taskId);
         const result = await UpdateTasks({
            taskId,
            status
         });
         return _res.status(200).json({
            updated:true,
            data:result
         })
    } catch (error) {
        next(error);
    }

})

