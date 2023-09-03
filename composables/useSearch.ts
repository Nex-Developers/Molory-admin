export async function setSearchValue(val: string) {
    const searchValue = useState<string>('searchValue')
    searchValue.value = val
}