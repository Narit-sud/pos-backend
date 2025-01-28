import { Router } from "express"
import {
    getAllVariantsHandle,
    getVariantsByMainUUIDHandle,
} from "../_handles/productVariant"

export const productVariantRouter = Router()

productVariantRouter.get("/", getAllVariantsHandle)
productVariantRouter.get("/:uuid", getVariantsByMainUUIDHandle)
