import { IWithdrawal } from './../types/IWithdrawal';



export async function  getWithdrawals() {
    const config = useRuntimeConfig()
    const withdrawals = useState<IWithdrawal[]>('withdrawals')
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/withdrawal`, { headers })
        withdrawals.value = data
        showLoader(false)
        return data
    } catch(err: any) {
        console.log(err.message)
        showLoader(false)
    }
}

// export async function getDocument(id: number) {
//     showLoader(true, 'Loading')
//     const users = useState<IUser[]>('documents').value
//     if (!users) await getDocuments()
//     showLoader(false)
//     return useState<IUser[]>('documents').value.find(item => item.id === id)
// }

