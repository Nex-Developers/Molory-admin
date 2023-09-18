import { ITrip } from "~~/types"


export async function getTrips() {
    showLoader(true, 'Chargement...')
    const config = useRuntimeConfig()
    const trips = useState<ITrip[]>('trips')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/trip`, { method: 'GET', headers })
        // console.log(data)
        useState<ITrip[]>('trips').value = data
        showLoader(false)
        return data
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}


export async function getTrip(id: number) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    try {
        showLoader(true, 'Chargement...')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/trip/${id}`, { method: 'GET', headers })
        // console.log(data)
        showLoader(false)
        return data
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

export async function updateTrip(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/trip`, { method: "PATCH", headers, body })
        showLoader(false)
        await getTrips()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

