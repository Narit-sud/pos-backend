import bcrypt from "bcrypt";

export async function encryptPassword(stringPassword: string) {
    const hashedPassword = await bcrypt.hash(stringPassword, 10);
    return hashedPassword;
}

export async function comparePassword(
    stringPassword: string,
    hashedPassword: string,
) {
    const isPasswordValid = await bcrypt.compare(
        stringPassword,
        hashedPassword,
    );
    return isPasswordValid;
}
