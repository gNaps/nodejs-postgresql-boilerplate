import { NextFunction, Request, Response } from "express"
import { authService } from "../api/auth/authService";

/**
 * Funzione di supporto che verifica se il token è valido per la chiamata in corso
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
        return res.sendStatus(401);
    }

    const result = await authService.verifyToken(token);

    if(!result || result.length == 0) {
        return res.sendStatus(401);
    }

    req.CurrentUser = result[0].user_id;

    next();
}

/** Verifica che l'utente che sta eseguendo la chiamata sia autorizzato su questa route */
export const verifyPolicy = async (req: Request, res: Response, next: NextFunction) => {
    const { method, route: { path: route }, CurrentUser } = req;
    const result = await authService.verifyPolicy(method, route, CurrentUser);

    console.log(method)
    console.log(route)
    console.log(CurrentUser)

    if(!result || result.length == 0) {
        return res.sendStatus(401);
    } else {
        console.log("Appartieni al gruppo: ", result[0].group_name);
    }

    next();
}