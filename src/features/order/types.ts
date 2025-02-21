export interface CartItemType {
    uuid: string;
    mainUUID: string;
    mainName: string;
    variantName: string;
    variantUUID: string;
    qty: number;
    price: number;
    total: number;
    receiptUUID: string;
}

export interface OrderType {
    uuid: string;
    customerUUID: string;
    saleItems: CartItemType[];
    createdAt: string;
    updatedAt: string;
}
