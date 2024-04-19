import path from "path";
import * as dotenv from 'dotenv'
dotenv.config()

export const  port= process.env.EXPRESS_PORT || 8000
export const  publicPath= path.join(__dirname, "public")
export const  db= {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  }
