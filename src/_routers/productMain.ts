import { Router } from "express"
import {
    createProductMainHandle,
    getAllProductMainHandle,
    getProductMainByUUIDHandle,
} from "../_handles/productMain"

export const productMainRouter = Router()

productMainRouter.get("/", getAllProductMainHandle)
productMainRouter.get("/:uuid", getProductMainByUUIDHandle)
productMainRouter.post("/create", createProductMainHandle)
