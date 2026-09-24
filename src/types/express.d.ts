import { PaylodToken } from "./user";


declare global {
    namespace Express {
        interface Request {
            user:PaylodToken
        }
    }
}
export {};