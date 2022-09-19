import { IUser } from "~~/types/IUser"



export async function  getDocuments() {
    const config = useRuntimeConfig()
    const documents = useState<IUser[]>('documents')
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/to-validate-user`, { headers })
        documents.value = data
        showLoader(false)
        return data
    } catch(err) {
        console.log(err.message)
        showLoader(false)
    }
}

export async function getDocument(id: number) {
    showLoader(true, 'Loading')
    const users = useState<IUser[]>('documents').value
    if (!users) await getDocuments()
    showLoader(false)
    return useState<IUser[]>('documents').value.find(item => item.id === id)
}

export async function validateIdCard(userId: number, response, cardNumber?) {
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/validate-id-card`, {  method: "POST", headers, body: { userId, response, cardNumber } })
        getDocuments()
    } catch (err) {
        console.log(err.message)
    }
}

export async function validateDriverLicense(userId: number, response, cardNumber?) {
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/validate-driver-license`, {  method: "POST", headers, body: { userId, response, cardNumber } })
        getDocuments()
    } catch (err) {
        console.log(err.message)
    }
  
}
