export type BaseApiType = {
    message: string | string[]
    error: string | string[]
}

export type Product = {
    id: number
    product: string
    quality?: string
    design?: string
    color?: string
    scale?: string
    materials?: string
    image?: string
    createdAt: string
    updatedAt: string
}

export type ProductListApi = {
    products: Product[]
    count: number
} & BaseApiType

export type ProductDeleteApi = BaseApiType