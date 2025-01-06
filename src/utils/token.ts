import jwt from "jsonwebtoken";

export async function generateJWT(data: object): Promise<string> {
    const token = jwt.sign(
        { data }, // Payload
        process.env.JWT_SECRET!, // Secret key
        { expiresIn: 24 * 3600 }, // Expiration time in seconds (24 hours)
    );
    return token;
}
