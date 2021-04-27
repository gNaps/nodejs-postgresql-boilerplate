import { request, Request, Response } from "express";
import { User } from "../../model/User";
import { sendMail } from "../../services/mailService";
import { userService } from "../user/userService";
import { authService } from "./authService";

/**
 * Stacca il token da inviare via mail all'utente per effettuare la login
 * @param req 
 * @param res 
 */
const sendTokenForLogin = async (req: Request, res: Response) => {
    const user: User = req.body;

    console.log("email arrivata ", user.email)
    // Verifico se utente esiste già, altrimenti lo creo
    const userExist_res = await userService.getByEmail(user.email);
    const userExist = userExist_res[0];

    console.log(userExist);

    if(!userExist) {
        console.log("non esiste lo creo")
        const newId = await userService.createUser(user);
        user.id = newId;
    } else {
        user.id = userExist.id;
    }

    // Genero il nuovo token per la login
    const token = await authService.generateNewToken(user.id);
    console.log("token generato è ", token)

    // Disabilito tutti i vecchi token associati a questo utente 
    await authService.disableOldToken(user.id, token);

    // Qui invio la mail all'utente
    sendMail("", user.email, "test invio mail", "questo è un test", "questo è un test", "");

    res.status(200).send(true);
}

/**
 * Se il token di riferimento è corretto allora utente si logga
 * @param req 
 * @param res 
 */
const login = async (req: Request, res: Response) => {

}

export const authController = {
    sendTokenForLogin
}