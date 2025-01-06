import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { FalseResponse } from "../utils/class";

export async function verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        const response = new FalseResponse("no token provided, access denined");
        res.status(401).send(response);
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error("SECRET KEY IS UNDEFINED");
        }

        const decode = jwt.verify(token, secretKey);
        if (!decode) {
            throw new Error("Invalid token");
        }

        next();
    } catch (error) {
        const response = new FalseResponse("Invalid token");
        res.status(403).send(response);
    }
}
