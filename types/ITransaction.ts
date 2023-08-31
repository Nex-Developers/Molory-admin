export interface ITransaction {
    id: string;
    type: 'string';
    amount: number;
    method: string;
    ref: string;
    walletId: string;
    status: number;
    createdAt: Date;
    validatedAt: Date;
}