import { IUser } from "./IUser"

export interface IPublication {
    id: number
    title: string
    message: string
    notifications: any[]
    user: IUser
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}