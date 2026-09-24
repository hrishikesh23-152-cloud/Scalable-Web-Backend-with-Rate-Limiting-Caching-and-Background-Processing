import { Apperror } from "../errors/Apperror";
import { Apirouter } from "../routes";
import { Task } from "../types/task";
import {CreateUserTask} from "../repositories/task.repository"
import {GetTasks,GetTask,UpdateSingleTask,DeleteSingleTask} from "../repositories/task.repository"
function Valid(title:unknown){
    if(typeof title !== 'string' || !title.trim()){
        throw new Apperror(400,"Invalid or empty title")
    }
    const result = title.trim();

    if(result.length>100){
        throw new Apperror(400,"The title exceeds the total length")
    }
    return result
}

export async function CreateTask(userId:string,title:string):Promise<Task>{
    const Validtitle = Valid(title);
    const result = await CreateUserTask(title,userId);

    return result
}

export async function GetAllTasks(userId:string):Promise<Task[]>{
    const result = await GetTasks(userId);
    if(result===null){
        throw new Apperror(404,"Tasks not found")
    }
    return result;
}

export async function GetSingleTask(TaskId:string,UserId:string):Promise<Task>{
    const result = await GetTask(TaskId,UserId);
    if(result===null){
        throw new Apperror(404,"Task not found")
    }
    return result;
}
export async function UpdateTask(taskId:string,userId:string,title:string):Promise<Task>{
    const validTitle = Valid(title);
    const result = await UpdateSingleTask(taskId,userId,validTitle);
    if(result==null){
        throw new Apperror(404,'Task not found')
    }
    return result;
}
export async function DeleteTask(taskId:string,userId:string):Promise<Task>{
    const result = await DeleteSingleTask(taskId,userId);
    if(result==null){
        throw new Apperror(404,'Task not found')
    }
    return result;
}