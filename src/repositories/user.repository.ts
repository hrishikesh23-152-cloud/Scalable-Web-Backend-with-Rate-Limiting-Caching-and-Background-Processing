import { pool } from "../lib/db";
import { Dbuser, DBuserWithPass, User } from "../types/user";

export async function ExistingUser(email:string):Promise<User|null>{
    const result = await pool.query<Dbuser>(
        `SELECT id,email,role,created_at FROM Users WHERE email = $1`,[email]
    )
    return result.rows[0] ?? null;
}
export async function createUser(email:string,
    password_hash:string):Promise<User>{
        const result = await pool.query<Dbuser>(
        `
        INSERT INTO Users (email,password_hash)
        VALUES($1,$2)
        RETURNING id,email,role,created_at 

        `,
        
        [email,password_hash]
    )
    return result.rows[0];
    }

export async function findUserWithEmail(email:string):Promise<DBuserWithPass | null>{
    const result = await pool.query<DBuserWithPass>(
        `SELECT id,role,email,password_hash,created_at
        FROM Users WHERE email=$1`,[email]
    )
    return result.rows[0] ?? null;
}