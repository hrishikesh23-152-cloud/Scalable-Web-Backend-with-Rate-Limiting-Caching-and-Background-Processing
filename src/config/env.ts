import dotenv from 'dotenv'

dotenv.config();

export const env = {
    port : Number(process.env.PORT ?? 3000),
    isProduction: (process.env.NODE_ENV ?? 'development') ==='production' ,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    Level: process.env.LOG_LEVEL ?? 'info',
    db_url:process.env.DATA_BASE_URL,
    jwtsecret:process.env.JWT_SECRET_KEY!,
    jwt_expiry:process.env.JWT_SECRET_KEY_TIME,
    redis_url:process.env.REDIS_URL,
    cloudinary_name:process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET,
    google_client_id:process.env.GOOGLE_CLIENT_ID,
    google_client_secret:process.env.GOOGLE_CLIENT_SECRET,
    google_redirect_url:process.env.GOOGLE_REDIRECT_URL
} as const ;

 