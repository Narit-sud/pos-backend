export interface ProductMain {
    index: number
    uuid: string
    name: string
    category: string
    detail: string
    createdAt: string
    updatedAt: string
}

export interface ProductMainCreate {
    name: string
    category: string
    detail: string
    type: string
}
