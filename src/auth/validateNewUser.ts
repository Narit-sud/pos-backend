import { User } from "../_interfaces/User"
import { CustomError } from "../_class/CustomError"

export const validateNewUser = (newUser: User): void => {
    // validate name
    if (typeof newUser.name === "undefined" || newUser.name === "") {
        throw new CustomError("Invalid user data: name empty", 400)
    } else if (newUser.name.split(" ").length > 1) {
        throw new CustomError("name contain space", 400)
    }

    // validate surname
    if (typeof newUser.surname === "undefined") {
        throw new CustomError("Invalid user data: surname empty", 400)
    } else if (newUser.surname.split(" ").length > 1) {
        throw new CustomError("Invalid user data: surname contain space", 400)
    }

    // validate email
    if (typeof newUser.email === "undefined") {
        throw new CustomError("Invalid user data: email empty", 400)
    } else if (newUser.email.split(" ").length > 1) {
        throw new CustomError("Invalid user data: email contain space", 400)
    }

    // validate phone_number
    if (typeof newUser.phone_number === "undefined") {
        throw new CustomError("Invalid user data: phone number empty", 400)
    } else if (newUser.phone_number.split(" ").length > 1) {
        throw new CustomError(
            "Invalid user data: phone number contain space",
            400,
        )
    } else if (newUser.phone_number.length !== 10) {
        throw new CustomError(
            "Invalid user data: phone number has to be 10 digits",
            400,
        )
    }

    // validate username
    if (typeof newUser.username === "undefined" || newUser.username === "") {
        throw new CustomError("Invalid user data: username empty", 400)
    } else if (newUser.username.split(" ").length > 1) {
        throw new CustomError("Invalid user data: username contain space", 400)
    } else if (newUser.username.length < 6) {
        throw new CustomError(
            "Invalid user data: username too short, need atleast 6 letters",
            400,
        )
    }

    // validate password
    if (typeof newUser.password === "undefined") {
        throw new CustomError("Invalid user data: password empty", 400)
    } else if (newUser.password.split(" ").length > 1) {
        throw new CustomError("Invalid user data: password contain space", 400)
    } else if (newUser.password.length > 10) {
        throw new CustomError(
            "Invalid user data: username too short, need atleast 10 charactors",
            400,
        )
    }
}
