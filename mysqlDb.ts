import mysql, {Connection} from "mysql2/promise";
import {db} from "./config";

let connection: Connection | null = null;
const mysqlDb = {
  async init() {
    connection = await mysql.createConnection(db);
  },
  getConnection(): Connection {
    if (!connection) throw new Error("Connection failed");
    return connection;
  },
};

export default mysqlDb;