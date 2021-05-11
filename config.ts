import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

export const dbConfig = {
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbDatabase: process.env.DB_DATABASE,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: process.env.DB_PORT
}

export const clientRedirect = process.env.CLIENT_REDIRECT_LOGIN;