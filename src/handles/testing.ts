import { Request, Response } from "express";
import { FalseResponse, TrueResponse } from "../class/Response";

export const testingHandle = {
    testCookie: (req: Request, res: Response) => {
        const cookies = req.cookies.jwt;
        console.log(cookies);

        if (!cookies) {
            res.status(400).send(new FalseResponse("no cookies provided"));
            return;
        } else {
            res.status(200).send(new TrueResponse("cookies provided", cookies));
            return;
        }
    },
};
