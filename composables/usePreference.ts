import { IPreference } from "~~/types"


export async function getPreferences() {
    const config = useRuntimeConfig()
    const preferences = useState<IPreference[]>('preferences')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/preference`, { method: 'GET', headers })
        console.log(data)
        useState<IPreference[]>('preferences').value = data
        return data
    } catch (err) {
        console.log(err.message)
    }
}


export async function getPreference(id: number) {
    if (!useState<IPreference[]>('preferences').value) await getPreferences()
    return  ref(useState<IPreference[]>('preferences').value.find(item => item.id === id))
}

export async function addPreference(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/preference`, { method: "POST", headers, body })
        getPreferences()
    } catch (err) {
        console.log(err.message)
    }
}


export async function updatePreference(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/preference`, { method: "PATCH", headers, body })
        getPreferences()
    } catch (err) {
        console.log(err.message)
    }
}

export async function deletePreference(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/preference`, { method: "DELETE", headers, body })
        getPreferences()
    } catch (err) {
        console.log(err.message)
    }
}


