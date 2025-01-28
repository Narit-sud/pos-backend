export interface User {
    id: number
    name: string
    surname: string
    email: string
    phone_number: string
    username: string
    password: string
    status: string
    role: string
}

export interface UserAuth {
    user: {
        id: number
        name: string
        surname: string
        email: string
        phone_number: string
        username: string
        status: string
        role: string
    }
    iat: number
    exp: number
}
