import { User } from "../types/User"
export const validateNewUser = (newUser: User): boolean => {
    // validate name
    if (typeof newUser.name === "undefined" || newUser.name === "") {
        throw new Error("name empty")
    } else if (newUser.name.split(" ").length > 1) {
        throw new Error("name contain space")
    }

    // validate surname
    if (typeof newUser.surname === "undefined") {
        throw new Error("surname empty")
    } else if (newUser.surname.split(" ").length > 1) {
        throw new Error("surname contain space")
    }

    // validate email
    if (typeof newUser.email === "undefined") {
        throw new Error("email empty")
    } else if (newUser.email.split(" ").length > 1) {
        throw new Error("email contain space")
    }

    // validate phone_number
    if (typeof newUser.phone_number === "undefined") {
        throw new Error("phone number empty")
    } else if (newUser.phone_number.split(" ").length > 1) {
        throw new Error("phone number contain space")
    } else if (newUser.phone_number.length !== 10) {
        throw new Error("phone number has to be 10 digits")
    }

    // validate username
    if (typeof newUser.username === "undefined" || newUser.username === "") {
        throw new Error("username empty")
    } else if (newUser.username.split(" ").length > 1) {
        throw new Error("username contain space")
    } else if (newUser.username.length < 6) {
        throw new Error("username too short, need atleast 6 letters")
    }

    // validate password
    if (typeof newUser.password === "undefined") {
        throw new Error("password empty")
    } else if (newUser.password.split(" ").length > 1) {
        throw new Error("password contain space")
    } else if (newUser.password.length > 10) {
        throw new Error("username too short, need atleast 10 charactors")
    }

    return true
}
