import cors from "cors";
import express from "express";
import {port} from './config'
import mysqlDb from "./mysqlDb";
import categoriesRouter from "./routers/categories";
import locationsRouter from "./routers/locations";
import recordsRouter from "./routers/records";

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use("/categories", categoriesRouter);
app.use("/locations", locationsRouter);
app.use("/records", recordsRouter);

const run = async () => {
  await mysqlDb.init();
  app.listen(port, () => {
    console.log("We are live on port: %d", port);
  });
};

run().catch(console.error);