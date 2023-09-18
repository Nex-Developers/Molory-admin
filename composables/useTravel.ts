
export async function getTravels() {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const travels = useState<any[]>('travels')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/travel`, { method: 'GET', headers })
        console.log(data)
        useState<any[]>('travels').value = data
        showLoader(false)
        return data
    } catch (err: any) {
        console.log(err.message)
        showLoader(false)
    }
}
