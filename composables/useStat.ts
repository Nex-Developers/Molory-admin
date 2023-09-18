
export async function  getStats() {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    const stats = useState<any>('stats')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const  data  = await $fetch<any>(`${config.BASE_URL}/stats`, { headers })
        console.log(data)
        stats.value = data
        showLoader(false)
        return data
    } catch(err: any) {
        console.log(err.message)
        showLoader(false)
    }
}
