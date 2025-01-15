import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { FalseResponse } from "../class/Response";

export async function generateJWT(data: object): Promise<string> {
    const token = jwt.sign(
        { data }, // Payload
        process.env.JWT_SECRET!, // Secret key
        { expiresIn: 24 * 3600 }, // Expiration time in seconds (24 hours)
    );
    return token;
}

export const Token = {
    generate: async (user: object) => {
        const token = jwt.sign(
            { user }, // Payload
            process.env.JWT_SECRET!, // Secret key
            { expiresIn: 24 * 3600 }, // Expiration time in seconds (24 hours)
        );
        return token;
    },
    verify: async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.jwt;

        if (!token) {
            const response = new FalseResponse(
                "no token provided, access denined",
            );
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
    },

    decode: (token: string) => {
        const decoded = jwt.decode(token);
        return decoded;
    },
};
