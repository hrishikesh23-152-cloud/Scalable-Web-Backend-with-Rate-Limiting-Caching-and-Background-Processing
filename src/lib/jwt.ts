import jwt,{SignOptions} from 'jsonwebtoken';
import { PaylodToken } from '../types/user';
import { env } from '../config/env';
import { Apperror } from '../errors/Apperror';



export function accesstokeGen(payload:PaylodToken):string {
    const options : SignOptions = {
        expiresIn:env.jwt_expiry as SignOptions["expiresIn"],
    };
    return jwt.sign(payload,env.jwtsecret,options)
}

export function verifyAccessToken(token:string):PaylodToken{
    try {
        return jwt.verify(token,env.jwtsecret) as PaylodToken
    } catch {
        throw new Apperror(401,"Incorrect or expired accesstoken")
    }
}