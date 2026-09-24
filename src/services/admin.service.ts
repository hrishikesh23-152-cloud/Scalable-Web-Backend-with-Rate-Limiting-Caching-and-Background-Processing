import { Apperror } from "../errors/Apperror";
import {AdminTaskResults,AdminTasks, UpdatePayload} from '../types/admin'
import { Task } from "../types/task";
import {findAllTasks,UpdateAnyTask} from '../repositories/admin.repository'
import { clearTasksFromCache, getTasksFromCache, setTasksFromCache } from "../lib/taskCaching";



export async function getAdminTasks(
    task:AdminTasks
):Promise<Task[]>{
    
    const search = task.search?.trim() || undefined;
    const status = task.status?.trim().toUpperCase() || undefined;
    const Statuses = ['OPEN','IN_PROGRESS','CLOSED'] as const;
    const TrueStatus = Statuses.includes(status as typeof Statuses[number]);
    if(!TrueStatus){
        throw new Apperror(400,'Incorrect status,status must be between open,in_progress,closed');
    }
    const input:AdminTasks = {
        search:search,
        status:status
    }
    const redis_result = await getTasksFromCache();
    if(redis_result!==null){
        return redis_result;
    }
    const result = await findAllTasks(input);
    await setTasksFromCache(result);
    if(result.length===0){
        throw new Apperror(404,'Tasks not found');
    }
    return result;
}

export async function UpdateTasks(
    input : UpdatePayload
):Promise<Task>{
    const status = input.status?.trim().toUpperCase() || undefined;
    const Statuses = ['OPEN','IN_PROGRESS','CLOSED'] as const;
    const TrueStatus = Statuses.includes(status as typeof Statuses[number]);
    if(!TrueStatus){
        throw new Apperror(400,'Incorrect status,status must be between open,in_progress,closed');
    }
    input.status = String(status);
    await clearTasksFromCache();
    const result = await UpdateAnyTask(input);
    if(result === null){
        throw new Apperror(404,'Task not found')
    }
    return result;
}