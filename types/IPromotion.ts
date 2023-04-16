export interface IPromotion {
    id: number
    name: string
    discount: number
    description: string
    limit: number
    startAt: Date
    endAt: Date
    status: number

    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}