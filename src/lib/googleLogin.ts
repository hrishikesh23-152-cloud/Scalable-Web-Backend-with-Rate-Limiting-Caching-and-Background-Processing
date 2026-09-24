import {OAuth2Client} from 'google-auth-library';
import {env} from '../config/env'
import { Apperror } from '../errors/Apperror';
export type UserProfile = {
    googleId:string,
    email:string
};

const googleOauthClient = new OAuth2Client(
    
       env.google_client_id!,
       env.google_client_secret!,
       env.google_redirect_url! 
    
);

export function getGoogleUrl():string{
    return googleOauthClient.generateAuthUrl(
        {
            scope:["openid","email","profile"],
            access_type:"online",
            prompt:"select_account",
        }
    )
}
export async function getGoogleUser(code:string):Promise<UserProfile>{
    if(!code){
        throw new Apperror(400,"Google auth code is required");
    }
    const {tokens} = await googleOauthClient.getToken(code)

    if(!tokens.id_token){
        throw new Apperror(401,"Google login failed please try again later:invalid user_id_token")
    }
    const ticketInfo = await googleOauthClient.verifyIdToken({
        idToken:tokens.id_token,
        audience:env.google_client_id
    });
    const payload = ticketInfo.getPayload();
    if(!payload?.email || !payload.sub){
        throw new Apperror(401,"Google login failed:invalid user profile")
    }
    return {
        googleId:payload.sub,
        email:payload.email
    };
}