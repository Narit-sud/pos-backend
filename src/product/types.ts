export type ProductMain = {
    index: number;
    uuid: string;
    name: string;
    category: string;
    detail: string;
    variantCount: number;
    createdAt: string;
    updatedAt: string;
};
export type ProductMainCreate = {
    name: string;
    category: string;
    detail: string;
    type: string;
};

export type ProductVariant = {
    index: number;
    uuid: string;
    name: string;
    cost: number;
    price: number;
    detail: string;
    mainProduct: string;
    createdAt?: string;
    updatedAt?: string;
};

export interface FullProduct extends ProductMain {
    variants: ProductVariant[];
}
