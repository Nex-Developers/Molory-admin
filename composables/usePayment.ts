import { IPayment } from "~~/types"



export async function  getPayments() {
    const config = useRuntimeConfig()
    const payments = useState<IPayment[]>('payments')
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/payment`, { headers })
        // console.log(data)
        payments.value = data
        showLoader(false)
        return data
    } catch(err: any) {
        console.log(err.message)
        showLoader(false)
    }
}
