import { pool } from "../lib/db";
import { Banner } from "../types/banner";


export async function InsertBannerIntoDb(
    secureUrl:string,
    publicUrl:string
):Promise<Banner>{
    const result = await pool.query<Banner>(
        `
        INSERT INTO banners(image_url, cloudinary_url)
        VALUES ($1,$2) 
        RETURNING id,image_url,cloudinary_url,created_at,updated_at
        `,[secureUrl,publicUrl]
    )
    return result.rows[0];
}

export async function GetAllUrl():Promise<Banner[]>{
    const result = await pool.query<Banner>(
        `
        SELECT id,image_url,cloudinary_url,created_at,updated_at
        FROM banners

        `
    )
    return result.rows ;
}

export async function DeleteBannerFromDb(
    bannerId:string
):Promise<string | null>{
    const result = await pool.query<{cloudinary_url:string}>(
        `
        DELETE FROM banners
        WHERE id = $1
        RETURNING cloudinary_url
        `,[bannerId]
    )
    return result.rows[0]?.cloudinary_url || null;
}