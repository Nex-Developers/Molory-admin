

// export async function getUsers() {
//     showLoader(true, 'Chargement...')
//     const config = useRuntimeConfig()
//     const users = useState<IUser[]>('users')
//     try {
//         const headers = {
//             Authorization: 'Bearer ' + useState<string>('auth_token').value,
//             'Content-Type': 'Application/json'
//         }
//         const { data } = await $fetch<any>(`${config.BASE_URL}/user`, { method: 'GET', headers })
//         // console.log(data)
//         useState<IUser[]>('users').value = data
//         showLoader(false)
//         return data
//     } catch (err: any) {
//         // console.log(err.message)
//         window.alert(err.message)
//         if(err.message.includes("403")) removeSessionToken()
//         showLoader(false)
//     }
// }


export async function getWallet(id: number) {
    // if (!useState<IUser[]>('users').value) await getUsers()
    // return  ref(useState<IUser[]>('users').value.find(item => item.id === id))
    showLoader(true, 'Chargement...')
    const config = useRuntimeConfig()
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/wallet/${id}`, { method: 'GET', headers })
        console.log(data)
        showLoader(false)
        return data
    } catch (err: any) {
        console.log(err.message)
        if(err.message.includes("403")) removeSessionToken()
        showLoader(false)
    }
}

export async function rechargeWallet(id: number, amount: number) {
    const res = window.confirm('Voulez vous effectuer une recharge de ' + amount + ' F CFA sur ce portefeuille?')
    if (!res) return
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
         await $fetch<any>(`${config.BASE_URL}/recharge-wallet`, { method: "PATCH", headers, body: { userId: id, amount} })
        showLoader(false)
        return true
        // return await getWallet(id)
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}


export async function withdrawWallet(id: number, amount: number) {
    const res = window.confirm('Voulez vous effectuer un retrait de ' + amount + ' F CFA sur ce portefeuille?')
    if (!res) return
    showLoader(true, 'Veuillez patienter...')
   
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        await $fetch<any>(`${config.BASE_URL}/withdraw-wallet`, { method: "PATCH", headers, body: { userId: id, amount} })
        showLoader(false)
        //  return await getWallet(id)
        return true
    } catch (err: any) {
        // console.log(err.message)
        window.alert(err.message)
        showLoader(false)
        if(err.code === 403) removeSessionToken()
    }
}

