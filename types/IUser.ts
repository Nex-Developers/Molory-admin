export interface IUser {
    id?:number
    lastName: string
    firstName: string
    phoneNumber: string
    email?: string
    gender?: string
    role: string
    avatar?: string
    birthDay: string
    createdAt?: string
    signUpMethod: string
    // documents
}