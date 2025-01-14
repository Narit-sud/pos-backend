import { User } from "../types/User";

// id: number;
// name: string;
// surname: string;
// email: string;
// phone_number: string;
// username: string;
// password: string;
// status: string;

export const validateNewuser = (newUser: User) => {
    if (typeof newUser.name === "undefined" || newUser.name === "") {
        return { valid: false, reason: "user name empty" };
    } else if (newUser.name.split(" ").length > 1) {
        return { valid: false, reason: `user name contain space` };
    }

    if (typeof newUser.surname === "undefined") {
        return { valid: false, reason: "user surname empty" };
    } else if (newUser.surname.split(" ").length > 1) {
        return { valid: false, reason: "user surname contain space" };
    }

    if (typeof newUser.email === "undefined") {
        return { valid: false, reason: "user email empty" };
    } else if (newUser.email.split(" ").length > 1) {
        return { valid: false, reason: "user email contain space" };
    }

    if (typeof newUser.phone_number === "undefined") {
        return { valid: false, reason: "user phone number empty" };
    } else if (newUser.email.split(" ").length > 1) {
        return { valid: false, reason: "user phone number contain space" };
    } else if (newUser.phone_number.length !== 10) {
        return { valid: false, reason: "phone number has to be 10 digits" };
    }

    if (typeof newUser.password === "undefined") {
        return { valid: false, reason: "user password empty" };
    } else if (newUser.password.split(" ").length > 1) {
        return { valid: false, reason: "user password contain space" };
    }

    return { valid: true };
};
