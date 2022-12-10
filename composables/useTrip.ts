import { ITrip } from "~~/types"


export async function getTrips() {
    const config = useRuntimeConfig()
    const trips = useState<ITrip[]>('trips')
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/trip`, { method: 'GET', headers })
        console.log(data)
        useState<ITrip[]>('trips').value = data
        showLoader(false)
        return data
    } catch (err) {
        console.log(err.message)
        showLoader(false)
    }
}


export async function getTrip(id: number) {
    const config = useRuntimeConfig()
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/trip/${id}`, { method: 'GET', headers })
        console.log(data)
        showLoader(false)
        return data
    } catch (err) {
        console.log(err.message)
        showLoader(false)
    }
}

export async function updateTrip(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/trip`, { method: "PATCH", headers, body })
        getTrips()
    } catch (err) {
        console.log(err.message)
    }
}

