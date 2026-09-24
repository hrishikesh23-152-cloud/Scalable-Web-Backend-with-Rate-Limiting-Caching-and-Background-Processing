import { futimes } from "node:fs";
import { pool } from "../lib/db";
import { Task } from "../types/task";



export async function CreateUserTask(
    title:string,
    userId:string
):Promise<Task>{
    const result = await pool.query<Task>(
        `INSERT INTO support_tasks(title,user_id)
        VALUES ($1,$2)
        RETURNING id,title,status,user_id,created_at,updated_at
        `,[title,userId]
    )
    return result.rows[0];
}

export async function GetTasks(userId:string):Promise<Task[]>{
    const result = await pool.query<Task>(
        `SELECT id,title,status,user_id,created_at,updated_at
        FROM support_tasks WHERE user_id=$1
        ORDER BY created_at DESC`,[userId]
    )

    return result.rows ?? null;
}
export async function  GetTask(TaskId:string,UserId:string):Promise<Task>{
    const result = await pool.query<Task>(
        `SELECT id,title,status,user_id,created_at,updated_at
        FROM support_tasks WHERE id=$1 AND user_id=$2`,[TaskId,UserId]
    )
    return result.rows[0] ?? null;
}
export async function UpdateSingleTask(taskId:string,userId:string,title:string):Promise<Task>{
    const result = await pool.query<Task>(

        `UPDATE support_tasks 
        SET title=$1,updated_at= NOW()
        WHERE id=$2 AND user_id=$3
        RETURNING id,title,status,user_id,created_at,updated_at`,[title,taskId,userId]
        
    )
    return result.rows[0] ?? null;
}
export async function DeleteSingleTask(taskId:string,uerId:string):Promise<Task>{
    const result = await pool.query<Task>(

        `DELETE FROM support_tasks 
        WHERE id=$1 AND user_id=$2
        RETURNING id,title,status,user_id,created_at,updated_at`,[taskId,uerId]

    )
    return result.rows[0] ?? null;
}