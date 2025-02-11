export type ProductLogType = {
    uuid: string;
    variantUUID: string;
    totalValue: number;
    qty: number;
    orderUUID: string | null;
    procurementUUID: string | null;
    createdAt: string;
    updatedAt: string;
};
