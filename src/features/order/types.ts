export interface SaleItemType {
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
    saleItems: SaleItemType[];
    createdAt: string;
    updatedAt: string;
}
