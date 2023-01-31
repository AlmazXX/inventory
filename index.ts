import cors from "cors";
import express from "express";
import categoriesRouter from "./routers/categories";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static("public"));
app.use('/categories', categoriesRouter);
app.use(express.json());

app.listen(port, () => {
  console.log("We are live on port: " + port);
});