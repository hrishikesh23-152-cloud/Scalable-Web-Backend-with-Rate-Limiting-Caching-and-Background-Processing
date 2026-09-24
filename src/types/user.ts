export type User = {
    id:string,
    email:string,
    role:string,
    created_at:Date
};
export type Dbuser = {
    id:string,
    email:string,
    role:string,
    created_at:Date
};
export type DBuserWithPass = Dbuser & {
    password_hash:string | null
};
export type LoginRes = {
    accessToken:string
}

export type PaylodToken = {
    userId:string,
    email:string,
    role:string
}