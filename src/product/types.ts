export type MainProductType = {
    index: number;
    uuid: string;
    name: string;
    category: string;
    detail: string;
    variantCount: number;
    createdAt: string;
    updatedAt: string;
    status: string;
};

export type VariantProductType = {
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

export interface FullProductType extends MainProductType {
    variants: VariantProductType[];
}
