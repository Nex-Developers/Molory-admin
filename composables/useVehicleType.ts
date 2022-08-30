import { IVehicleType } from './../types';


export async function getVehicleTypes() {
    const config = useRuntimeConfig()
    const vehicleTypes = useState<IVehicleType[]>('vehicleTypes')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/vehicle-type`, { method: 'GET', headers })
        console.log(data)
        useState<IVehicleType[]>('vehicleTypes').value = data
        return data
    } catch (err) {
        console.log(err.message)
    }
}


export async function getVehicleType(id: number) {
    if (!useState<IVehicleType[]>('vehicleTypes').value) await getVehicleTypes()
    return  ref(useState<IVehicleType[]>('vehicleTypes').value.find(item => item.id === id))
}

export async function addVehicleType(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/vehicle-type`, { method: "POST", headers, body })
        getVehicleTypes()
    } catch (err) {
        console.log(err.message)
    }
}

export async function updateVehicleType(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/vehicle-type`, { method: "PATCH", headers, body })
        getVehicleTypes()
    } catch (err) {
        console.log(err.message)
    }
}

export async function deleteVehicleType(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/vehicle-type`, { method: "DELETE", headers, body })
        getVehicleTypes()
    } catch (err) {
        console.log(err.message)
    }
}

