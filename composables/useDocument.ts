import { IUser } from "~~/types/IUser"



export async function  getDocuments() {
    const config = useRuntimeConfig()
    const documents = useState<IUser[]>('documents')
    try {
        showLoader(true, 'Chargment...')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/to-validate-user`, { headers })
        documents.value = data
        showLoader(false)
        return data
    } catch(err: any) {
        console.log(err.message)
        showLoader(false)
    }
}

export async function getDocument(id: number) {
    showLoader(true, 'Chargement...')
    const users = useState<IUser[]>('documents').value
    if (!users) await getDocuments()
    showLoader(false)
    return useState<IUser[]>('documents').value.find(item => item.id === id)
}

export async function validateIdCard(userId: number, response, cardNumber?) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/validate-id-card`, {  method: "POST", headers, body: { userId, response, cardNumber } })
        showLoader(false)
        await getDocuments()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

export async function validateDriverLicense(userId: number, response, cardNumber?) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/validate-driver-license`, {  method: "POST", headers, body: { userId, response, cardNumber } })
        showLoader(false)
        await getDocuments()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
  
}
