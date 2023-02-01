import cors from "cors";
import express from "express";
import categoriesRouter from "./routers/categories";
import locationsRouter from "./routers/locations";
import recordsRouter from "./routers/records";
import mysqlDb from "./mysqlDb";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/records', recordsRouter);

const run = async () => {
  await mysqlDb.init();
  app.listen(port, () => {
    console.log("We are live on port: " + port);
  });
}

run().catch(console.error);