import { Router } from "express";
import { OkPacket } from "mysql2";
import mysqlDb from "../mysqlDb";
import { ApiCategory, Category } from "../types";

const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  const connection = mysqlDb.getConnection();
  const query = await connection.query("SELECT id, title FROM categories");
  const categories = query[0] as ApiCategory[];
  res.send(categories);
});

categoriesRouter.get("/:id", async (req, res) => {
  const connection = mysqlDb.getConnection();
  const query = await connection.query(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id]
  );
  const [category] = query[0] as ApiCategory[];

  if (!category) {
    return res.status(404).send({ error: "Not found" });
  }
  res.send(category);
});

categoriesRouter.post("/", async (req, res) => {
  if (!req.body.title) {
    return res.status(404).send({ error: 'Field "Title" is required' });
  }

  const categoryData: Category = {
    title: req.body.title,
    description: req.body.description,
  };

  const connection = mysqlDb.getConnection();
  const query = await connection.query(
    "INSERT INTO categories (title, description) VALUES (?, ?)",
    [categoryData.title, categoryData.description]
  );
  const info = query[0] as OkPacket;

  res.send({ ...categoryData, id: info.insertId });
});

categoriesRouter.delete("/:id", async (req, res) => {
  const connection = mysqlDb.getConnection();
  const query = await connection.query(
    "SELECT * FROM records WHERE category_id = ?",
    [req.params.id]
  );
  const [category] = query[0] as ApiCategory[];

  if (category) {
    return res.status(404).send({ error: "Cannot delete a parent row" });
  }
  await connection.query("DELETE FROM categories WHERE id = ?", [
    req.params.id,
  ]);
  res.send({ message: "Deleted" });
});

categoriesRouter.put("/:id", async (req, res) => {
  if (!req.body.title) {
    return res.status(404).send({ error: 'Field "Title" is required' });
  }

  const categoryData: Category = {
    title: req.body.title,
    description: req.body.description,
  };

  const connection = mysqlDb.getConnection();
  await connection.query(
    "UPDATE categories SET title = ?, description = ? WHERE id = ?",
    [categoryData.title, categoryData.description, req.params.id]
  );

  res.send({ id: req.params.id, ...categoryData });
});

export default categoriesRouter;