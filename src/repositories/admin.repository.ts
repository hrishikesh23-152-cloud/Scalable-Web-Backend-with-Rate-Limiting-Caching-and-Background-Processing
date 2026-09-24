import { pool } from "../lib/db";
import { AdminTaskResults,AdminTasks, UpdatePayload } from "../types/admin";
import { Task } from "../types/task";



export async function findAllTasks(input:AdminTasks):Promise<Task[]>{
    const conditions: string[] = [];
    const values : unknown[] = [];
    let index = 1;
    if(input.search){
        conditions.push(`title ILIKE $${index}`)
        values.push(`%${input.search}%`);
        index++;;
    }
    if(input.status){
        conditions.push(`status = $${index}`);
        values.push(`${input.status}`);
    }
    const statement = conditions.length>0 ? `WHERE ${conditions.join(' AND ')}` : " ";
    const result = await pool.query<Task>(
        `SELECT id,title,status,user_id,created_at,updated_at
        FROM support_tasks 
        ${statement}
        ORDER BY created_at`,values
    )

    return result.rows ;
}

export async function UpdateAnyTask(
    input:UpdatePayload
):Promise<Task | null>{
    const taskId = input.taskId;
    const status = input.status;
    const result = await pool.query<Task>(
        `UPDATE support_tasks
        SET status = $1 ,updated_at = NOW()
        WHERE id = $2
        RETURNING id,title,status,user_id,created_at,updated_at
        `,[status,taskId]
    )
    return result.rows[0] ?? null;
}