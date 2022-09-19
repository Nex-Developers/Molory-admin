export function showLoader(val: boolean, message?: string) {
    console.log('loader', val)
    useState<boolean>('showLoader').value  = val
    useState<string>('loaderMessage').value  = message
}

export function showAlert(title: string, description: string, type: string) {
    useState<boolean>('showAlert').value  = true
    useState<any>('alert').value  = { title, description, type}
    setTimeout(() => closeAlert(),5 * 1000)
}

export function closeAlert() {
    useState<boolean>('showAlert').value  = false
    useState<any>('alert').value  = null
}
