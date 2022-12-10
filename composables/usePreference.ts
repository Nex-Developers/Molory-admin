import { IPreference, IQuestion } from "~~/types"


export async function getQuestions() {
    const config = useRuntimeConfig()
    const questions = useState<IQuestion[]>('questions')
    try {
        const headers = {
            Authorization: 'Bearer ' + useState<string>('auth_token').value,
            'Content-Type': 'Application/json'
        }
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: 'GET', headers })
        console.log(data)
        useState<IQuestion[]>('questions').value = data
        return data
    } catch (err) {
        console.log(err.message)
    }
}

export async function addQuestion(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: "POST", headers, body })
        getQuestions()
    } catch (err) {
        console.log(err.message)
    }
}

export async function addAnswer(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/answer`, { method: "POST", headers, body })
        getQuestions()
    } catch (err) {
        console.log(err.message)
    }
}

export async function updateQuestion(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: "PATCH", headers, body })
        getQuestions()
    } catch (err) {
        console.log(err.message)
    }
}

export async function updateAnswer(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/answer`, { method: "PATCH", headers, body })
        getQuestions()
    } catch (err) {
        console.log(err.message)
    }
}


export async function deleteQuestion(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/question`, { method: "DELETE", headers, body })
        getQuestions()
    } catch (err) {
        console.log(err.message)
    }
}

export async function deleteAnswer(body: any) {
    const config = useRuntimeConfig()
    console.log(useState<string>('auth_token').value)
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
        'Content-Type': 'Application/json'
    }
    try {
        const { data } = await $fetch<any>(`${config.BASE_URL}/answer`, { method: "DELETE", headers, body })
        getQuestions()
    } catch (err) {
        console.log(err.message)
    }
}

