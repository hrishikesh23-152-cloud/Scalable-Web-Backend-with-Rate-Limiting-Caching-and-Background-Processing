export type AdminTasks = {
    search?:string,
    status?:string
}
export type AdminTaskResults = {
    data:AdminTasks[]
}
export type UpdatePayload = {
    taskId:string,
    status: string
}