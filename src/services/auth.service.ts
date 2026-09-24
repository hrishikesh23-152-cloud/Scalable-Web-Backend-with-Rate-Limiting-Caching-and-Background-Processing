import { PasswordLength } from "../constant/user_constant";
import { Apperror } from "../errors/Apperror";
import {ExistingUser} from '../repositories/user.repository';
import {createUser} from '../repositories/user.repository'
import bcrypt from "bcryptjs";
import {accesstokeGen} from '../lib/jwt'
import {findUserWithEmail,findUserByGoogleId,linkGoogleWithUser,createGoogleUser} from '../repositories/user.repository'
import { LoginRes, User } from "../types/user";
import { getGoogleUrl,getGoogleUser } from "../lib/googleLogin";


export async function registerUser(
    email:string,
    password:string
):Promise<void>{
    if(!email || !password){
        throw new Apperror(400,"Please provide email and password")
    }
    if(password.length<PasswordLength.length){
        throw new Apperror(400,"Password must be atleast 6 characters long")
    }
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await ExistingUser(normalizedEmail)

    if(existingUser!=null){
        throw new Apperror(409,"user with this email already present")
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await createUser(normalizedEmail,hashedPassword);
    
}

export async function loginUser(
    email:string,
    password:string
):Promise<LoginRes>{
    if(!email || !password){
        throw new Apperror(400,"Please provide email and password")
    }
    const normalizedEmail = email.toLowerCase().trim();
    const User = await findUserWithEmail(normalizedEmail);
    if(!User?.password_hash){
        throw new Apperror(401,"Invalid email or password");
    }
    const isPassword = await bcrypt.compare(password,User.password_hash);
    if(!isPassword){
        throw new Apperror(401,"Invalid email or password");
    }
    const accessToken = await accesstokeGen({
        userId:User.id,
        email:User.email,
        role:User.role
    })
    return {accessToken};
}

export function googleLogin():string{
    return getGoogleUrl();
}
function GenAccessToken(user:User):string{
    return accesstokeGen(
      {
          userId:user.id,
        email:user.email,
        role:user.role
      }
    )

}
export async function getinfoFromGoogle(code:string):Promise<{accessToken:string}>{
    const info = await getGoogleUser(code);
    let user = await findUserByGoogleId(info.googleId);
    if(!user){
        user = await findUserWithEmail(info.email)
        if(user){
            user = await linkGoogleWithUser(user.id,info.googleId)
        }
        user = await createGoogleUser(info.email,info.googleId)
    }
    const accessToken = GenAccessToken(user);
    return {accessToken};
}