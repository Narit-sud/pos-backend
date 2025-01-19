import { Router } from "express";
import { testingHandle } from "../handles/testing";

export const TestingRouter = Router();

TestingRouter.get("/cookie", testingHandle.testCookie);
