import { IUser } from "~~/types/IUser"


export async function getUsers() {
    const config = useRuntimeConfig()
    const users = useState<IUser[]>('users')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/user`, { method: 'GET', headers })
        console.log(data)
        useState<IUser[]>('users').value = data
        return data
    } catch (err) {
        console.log(err.message)
    }
}


export async function getUser(id: number) {
    if (!useState<IUser[]>('users').value) await getUsers()
    return  ref(useState<IUser[]>('users').value.find(item => item.id === id))
}

export async function updateUser(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/user`, { method: "PATCH", headers, body })
        getUsers()
    } catch (err) {
        console.log(err.message)
    }
}

