import { IUser } from "~~/types/IUser"


export async function getUsers() {
    const config = useRuntimeConfig()
    const users = useState<IUser[]>('users')
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/user`, { method: 'GET', headers })
        console.log(data)
        useState<IUser[]>('users').value = data
        showLoader(false)
        return data
    } catch (err) {
        console.log(err.message)
        if(err.message.includes("403")) removeSessionToken()
        showLoader(false)
    }
}


export async function getUser(id: number) {
    // if (!useState<IUser[]>('users').value) await getUsers()
    // return  ref(useState<IUser[]>('users').value.find(item => item.id === id))
    const config = useRuntimeConfig()
    try {
        showLoader(true, 'Loading')
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/user/${id}`, { method: 'GET', headers })
        console.log(data)
        showLoader(false)
        return data
    } catch (err) {
        console.log(err.message)
        if(err.message.includes("403")) removeSessionToken()
        showLoader(false)
    }
}

export async function addUser(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/user`, { method: "POST", headers, body })
        getUsers()
    } catch (err) {
        console.log(err.message)
        if(err.code === 403) removeSessionToken()
    }
}


export async function updateUser(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        await $fetch<any>(`${config.BASE_URL}/user`, { method: "PATCH", headers, body })
        const { data } =  await getUser(body.id)
        return data
    } catch (err) {
        console.log(err.message)
        if(err.code === 403) removeSessionToken()
    }
}

