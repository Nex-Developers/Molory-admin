import { IPublication } from "~~/types"

export async function getPublications() {
    showLoader(true, 'Chargement...')
    const config = useRuntimeConfig()
    const publications = useState<IPublication[]>('publications')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/notification`, { method: 'GET', headers })
        // console.log(data)
        useState<IPublication[]>('publications').value = data
        showLoader(false)
        return data
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}


export async function addPublication(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/notification`, { method: "POST", headers, body })
        showLoader(false)
        await getPublications()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}