import path from "node:path";
import { pool } from "../lib/db";
import fs from 'node:fs'
import { logger } from "../lib/logger";


const MIGR_DIR = path.join(process.cwd(),'migrations');

const CREATE_MIGRATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(225) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
)
`;
 
type Mrow = {
    name:string
}

async function getExecutedMigrants():Promise<string[]>{
    const result = await pool.query<Mrow>(
        "SELECT name FROM migrations ORDER BY name"
    )
    return result.rows.map((row:Mrow)=>row.name)
}

function getMigrationFiles():string[] {
    return fs.readdirSync(MIGR_DIR).filter((file)=>file.endsWith('.sql')).sort();
}

async function runMigration(filename:string):Promise<void>{
    const filed = fs.readFileSync(path.join(MIGR_DIR,filename),'utf-8');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(filed);
        await client.query('INSERT INTO migrations (name) VALUES ($1)',[filename])
        await client.query('COMMIT')
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    }
    finally{
         client.release();
    }
}

async function migrate(): Promise<void> {
    await pool.query(CREATE_MIGRATIONS_TABLE_SQL)

    const executed = new Set(await getExecutedMigrants())
    const pending = getMigrationFiles().filter((file)=>!executed.has(file))

    if(pending.length===0){
        logger.info('No pending migration');
        return ;
    }
    for(const filename of pending){
        await runMigration(filename)
    }
    logger.info('All migrations are completed')
}
migrate()
.catch((error)=>{
    logger.error({err:error},'Migration failed')
    process.exit(1);
})
.finally(()=>pool.end());