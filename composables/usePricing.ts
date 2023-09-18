import { IPricing } from "~~/types"


export async function getPricings() {
    const config = useRuntimeConfig()
    const pricings = useState<{ name: string; pricings: IPricing[]}[]>('pricings')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/pricing`, { method: 'GET', headers })
        // console.log(data)
        useState<{ name: string; pricings: IPricing[]}[]>('pricings').value = data
        return data
    } catch (err: any) {
        console.log(err.message)
    }
}


// export async function getPricing(id: number) {
//     if (!useState<{ name: string; pricings: IPricing[]}[]>('pricings').value) await getPricings()
//     return  ref(useState<{ name: string; pricings: IPricing[]}[]>('pricings').value.find(item => item.id === id))
// }

export async function addPricing(body: any) {
    // console.log(body)
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/pricing`, { method: "POST", headers, body })
        getPricings()
    } catch (err) {
        console.log(err.message)
    }
}


export async function updatePricing(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/pricing`, { method: "PATCH", headers, body })
        getPricings()
    } catch (err) {
        console.log(err.message)
    }
}

export async function deletePricing(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/pricing`, { method: "DELETE", headers, body })
        getPricings()
    } catch (err) {
        console.log(err.message)
    }
}


