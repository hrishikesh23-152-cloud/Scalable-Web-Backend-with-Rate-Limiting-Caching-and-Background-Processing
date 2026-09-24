import { NextFunction, Router } from "express";
import { Request,Response } from "express";
import { authMiddle } from "../middlewares/auth.middleware";
import { CreateTask, GetSingleTask } from "../services/task.service";
import {GetAllTasks,UpdateTask,DeleteTask} from "../services/task.service"
import { RateLimitMiddleWare } from "../middlewares/rateLimiting";
export const TaskRouter = Router();

TaskRouter.use(authMiddle,RateLimitMiddleWare);

TaskRouter.post('/create', async (req:Request,_res:Response,next:NextFunction)=>{
   try {
     const{title} = req.body;
    const task = await CreateTask(req.user!.userId,title)

    return _res.status(201).json({
        success:true,
        data:task
    })
   } catch (error) {
    next(error)
   }
})
TaskRouter.get('/get', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const {userId} = req.user;
        const data = await GetAllTasks(userId)
        return _res.status(200).json({
            success:true,
            information:data
        })
    } catch (error) {
        next(error);
    }
})
TaskRouter.get("/get/:taskId", async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const taskId = String(req.params.taskId);
        const {userId} = req.user
        const result = await GetSingleTask(taskId,userId)

        return _res.status(200).json({
            success:true,
            information:result
        })
    } catch (error) {
        next(error)
    }
})
TaskRouter.patch('/update/:taskId', async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const {title} = req.body;
        const taskId = String(req.params.taskId);
        const userId = req.user.userId;
        const result = await UpdateTask(taskId,userId,title);
        return _res.status(200).json({
            updated:true,
            data:result
        })
    } catch (error) {
        next(error);
    }
})
TaskRouter.delete('/delete/:taskId',async (req:Request,_res:Response,next:NextFunction)=>{
    try {
        const taskId = String(req.params.taskId);
        const result = await DeleteTask(taskId,req.user.userId);
        return _res.status(200).json({
            deleted:true,
            deleted_data:result
        })
    } catch (error) {
        next(error);
    }
})