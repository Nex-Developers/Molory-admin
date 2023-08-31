import { ITransaction } from '../types/ITransaction';



export async function  getTransactions() {
    const config = useRuntimeConfig()
    const withdrawals = useState<ITransaction[]>('transactions')
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/transactions`, { headers })
        withdrawals.value = data
        showLoader(false)
        return data
    } catch(err: any) {
        console.log(err.message)
        showLoader(false)
    }
}

export async function getTransaction(id: string) {
    if (!useState<ITransaction[]>('transactions').value) await getTransactions()
    return  ref(useState<ITransaction[]>('transactions').value.find(item => item.id === id))
}

// export async function getDocument(id: number) {
//     showLoader(true, 'Loading')
//     const users = useState<IUser[]>('documents').value
//     if (!users) await getDocuments()
//     showLoader(false)
//     return useState<IUser[]>('documents').value.find(item => item.id === id)
// }

