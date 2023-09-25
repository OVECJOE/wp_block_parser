export const generateUniqueID = () => {
    const timestamp = new Date().getTime().toString(16)
    const randomSalt = Math.random().toString(16).slice(0, 8)

    return `${timestamp}-${randomSalt}`
}
