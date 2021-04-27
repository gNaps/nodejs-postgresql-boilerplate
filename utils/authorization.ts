import { NextFunction, Request, Response } from "express"
import { authService } from "../api/auth/authService";

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

    req.CurrentUser = result[0];

    next();
}