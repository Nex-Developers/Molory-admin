import { IPromotion } from './../types';


export async function getPromotions() {
    showLoader(true, 'Chargement...')
    const config = useRuntimeConfig()
    const Promotions = useState<IPromotion[]>('Promotions')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: 'GET', headers })
        // console.log(data)
        useState<IPromotion[]>('promotions').value = data
        showLoader(false)
        return data
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}


export async function getPromotion(id: number) {
    if (!useState<IPromotion[]>('Promotions').value) await getPromotions()
    return  ref(useState<IPromotion[]>('promotions').value.find(item => item.id === id))
}

export async function addPromotion(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: "POST", headers, body })
        showLoader(false)
        await getPromotions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

export async function updatePromotion(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: "PATCH", headers, body })
        showLoader(false)
        await getPromotions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

export async function deletePromotion(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/promotion`, { method: "DELETE", headers, body })
        showLoader(false)
        await getPromotions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

