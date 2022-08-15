import { useRouter, useState } from "#app";
import { ISession } from "~~/types/ISession";
import { IUser } from "~/types/IUser";



export async function useUser(): Promise<IUser> {
    const user = useState<IUser>('user')
    const token = useState<string>('auth_token')
    if (!token.value && !user.value) {
        const data = JSON.parse(window.sessionStorage.getItem('m_auth_ss'))
        useState<string>('auth_token').value = data?.token
        user.value = data?.user as IUser
    }

    return user.value
}


export async function setSession(token: string, user: IUser): Promise<void> {
    useState<string>('auth_token').value = token
    useState('user').value = user
    window.sessionStorage.setItem('m_auth_ss', JSON.stringify({ token, user }))
}

export async function userLogout() {
    const config = useRuntimeConfig()
    const headers = {
        Authorization: 'Bearer ' + useState<string>('auth_token').value,
    }
    await $fetch(`${config.BASE_URL}/auth/logout`, { method: 'POST', headers })
    useState('user').value = null
    window.sessionStorage.removeItem('m_auth_ss')
    await useRouter().push('/login')
}

export async function registerWithEmail(
    username: string,
    name: string,
    email: string,
    password: string
): Promise<FormValidation> {

    try {
        const { data, error } = await useFetch<ISession>('/api/auth/register', {
            method: 'POST',
            body: { data: { username, name, email, password } }
        })

        if (error.value) {
            type ErrorData = {
                data: ErrorData
            }

            const errorData = error.value as unknown as ErrorData
            const errors = errorData.data.data as unknown as string
            const res = JSON.parse(errors)
            const errorMap = new Map<string, { check: InputValidation; }>(Object.entries(res));

            return { hasErrors: true, errors: errorMap }
        }

        if (data) {
            useState('user').value = data
            await useRouter().push('/dashboard')
        }
    } catch (e) {
        console.log('error: ' + e.toString())
    }
}

export async function loginWithEmail(email: string, password: string) {
    const config = useRuntimeConfig()
    const { data, token, message, statusCode, error } = await $fetch<{ token: string, statusCode: number, message: string, data: IUser, error?: string }>(`${config.BASE_URL}/auth/login`, { method: 'POST', body: { email: email, password: password } })
    if (error) {
        window.alert(error)
        return { hasErrors: true, errors: new Map([['email', { check: 'email', message: error }]]) }
    }
    console.log(token)
    setSession(token, data)
    await useRouter().push('/')
}