export interface IPromotion {
    id: number
    name: string
    discount: number
    description: string
    limit: number
    startAt: Date
    endAt: Date
    status: number
    isForDriver: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}