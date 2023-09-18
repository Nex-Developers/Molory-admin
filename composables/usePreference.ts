import { IPreference, IQuestion } from "~~/types"


export async function getQuestions() {
    showLoader(true, 'Chargement...')
    const config = useRuntimeConfig()
    const questions = useState<IQuestion[]>('questions')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: 'GET', headers })
        // console.log(data)
        useState<IQuestion[]>('questions').value = data
        showLoader(false)
        return data
    } catch (err: any) {
        // console.log(err.message)
        window.alert(err.message)
        showLoader(false)
    }
}

export async function addQuestion(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: "POST", headers, body })
        showLoader(false)
        await getQuestions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)

    }
}

export async function addAnswer(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/answer`, { method: "POST", headers, body })
        showLoader(false)
        await getQuestions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)

    }
}

export async function updateQuestion(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: "PATCH", headers, body })
        showLoader(false)
        await getQuestions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

export async function updateAnswer(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/answer`, { method: "PATCH", headers, body })
        showLoader(false)
        await getQuestions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}


export async function deleteQuestion(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: "DELETE", headers, body })
        showLoader(false)
        await getQuestions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

export async function deleteAnswer(body: any) {
    showLoader(true, 'Veuillez patienter...')
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/answer`, { method: "DELETE", headers, body })
        showLoader(false)
        await getQuestions()
    } catch (err: any) {
        showLoader(false)
        // console.log(err.message)
        window.alert(err.message)
    }
}

