import { Router } from "express"
import {
    testGetAllProductIncludeProductMainAndVariantHandle,
    testingHandle,
} from "./handle"

export const TestingRouter = Router()

TestingRouter.get("/cookie", testingHandle.testCookie)
TestingRouter.get(
    "/productVariant",
    testGetAllProductIncludeProductMainAndVariantHandle,
)
