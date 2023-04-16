import { IPromotion } from './../types';


export async function getPromotions() {
    const config = useRuntimeConfig()
    const Promotions = useState<IPromotion[]>('Promotions')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: 'GET', headers })
        console.log(data)
        useState<IPromotion[]>('promotions').value = data
        return data
    } catch (err: any) {
        console.log(err.message)
    }
}


export async function getPromotion(id: number) {
    if (!useState<IPromotion[]>('Promotions').value) await getPromotions()
    return  ref(useState<IPromotion[]>('promotions').value.find(item => item.id === id))
}

export async function addPromotion(body: any) {
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: "POST", headers, body })
        getPromotions()
    } catch (err: any) {
        console.log(err.message)
    }
}

export async function updatePromotion(body: any) {
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: "PATCH", headers, body })
        getPromotions()
    } catch (err: any) {
        console.log(err.message)
    }
}

export async function deletePromotion(body: any) {
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: "DELETE", headers, body })
        getPromotions()
    } catch (err: any) {
        console.log(err.message)
    }
}

