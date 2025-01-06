declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload; // Adjust this type if your payload has custom fields
        }
    }
}
