import { IAnswer } from "."

export interface IQuestion {
    id?: number
    users?: string
    value: string
    answers?: IAnswer[]
}
