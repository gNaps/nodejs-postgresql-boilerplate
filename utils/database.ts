import { Pool } from 'pg';
import { dbConfig } from '../config'

export const pool = new Pool({
  user: dbConfig.dbUser,
  host: dbConfig.dbHost,
  database: dbConfig.dbDatabase,
  password: dbConfig.dbPassword,
  port: parseInt(dbConfig.dbPort!),
  ssl: true
});