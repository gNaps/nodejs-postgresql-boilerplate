import { Request, Response } from "express";
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

    // Verifico se utente esiste già, altrimenti lo creo
    const userExist_res = await userService.getByEmail(user.email);
    const userExist = userExist_res[0];

    if(!userExist) {
        console.log("non esiste lo creo")
        const newId = await userService.createUser(user);
        user.id = newId;
    } else {
        user.id = userExist.id;
    }

    // Genero il nuovo token per la login
    const token = await authService.generateNewToken(user.id);

    // Disabilito tutti i vecchi token associati a questo utente 
    // Per ora no altrimenti perde le connessione nei vari device 
    //await authService.disableOldToken(user.id, token);

    // Qui invio la mail all'utente
    const emailObject = "";
    const emailSubject = `Ciao, per procedere con la login tramite magic link clicca qui : ${token}`;
    sendMail("", user.email, emailObject, emailSubject, emailSubject, "");

    res.status(200).send(true);
}

/**
 * Se il token di riferimento è corretto allora utente si logga
 * @param req 
 * @param res 
 */
const getLoggedUserByToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    // Controllo che il token sia un guid valido
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i
    const checkUuid = regex.test(token);

    if(!checkUuid) {
        res.status(400).send("Not valid token");
        return;
    }

    // Recupero utente con il token in ingresso
    const users: Array<User> = await userService.getUserByToken(token);
    
    if(!users || users.length === 0) {
        res.status(401).send("Not found");
    } else {
        const user = users[0];
        res.status(200).json(user);
    }
}

export const authController = {
    sendTokenForLogin,
    getLoggedUserByToken
}