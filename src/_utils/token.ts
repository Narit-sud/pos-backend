import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { FalseResponse } from "../_class/Response"

type Decode = {
    username: string
    iat: number
    exp: number
}

export async function generateJWT(data: object): Promise<string> {
    const token = jwt.sign(
        { data }, // Payload
        process.env.JWT_SECRET!, // Secret key
        { expiresIn: 24 * 3600 }, // Expiration time in seconds (24 hours)
    )
    return token
}

export const Token = {
    generate: async (username: object) => {
        const token = jwt.sign(
            { username }, // Payload
            process.env.JWT_SECRET!, // Secret key
            { expiresIn: 24 * 3600 }, // Expiration time in seconds (24 hours)
        )
        return token
    },
    verify: async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.jwt

        if (!token) {
            const response = new FalseResponse(
                "no token provided, access denined",
            )
            res.status(401).send(response)
            return
        }

        try {
            const secretKey = process.env.JWT_SECRET
            if (!secretKey) {
                throw new Error("SECRET KEY IS UNDEFINED")
            }

            const decode = jwt.verify(token, secretKey)
            if (!decode) {
                throw new Error("Invalid token")
            }

            next()
        } catch (error) {
            const response = new FalseResponse("Invalid token")
            res.status(403).send(response)
        }
    },

    decode: (token: string): JwtPayload => {
        const decoded = jwt.decode(token)
        if (typeof decoded === "object" && decoded !== null) {
            return decoded
        } else {
            throw new Error("token decode failed")
        }
    },
}
