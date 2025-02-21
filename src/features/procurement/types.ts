import { ProductLogType } from "../productLog/types";
export type ProcurementType = {
    uuid: string;
    supplierUUID: string;
    isPaid: boolean;
    isReceived: boolean;
    billDate: string;
    createdAt: string;
    updatedAt: string;
    procurementItems: ProductLogType[];
};
