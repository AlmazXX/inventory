import {Router} from "express";
import {OkPacket} from "mysql2";
import mysqlDb from "../mysqlDb";
import {ApiCategory, Category} from "../types";

const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const connection = mysqlDb.getConnection();
    const query = await connection.query("SELECT id, title FROM categories");
    const { 0: categories} = query;
    return res.send(categories);
  } catch (error) {
    return next(error)
  }
});

categoriesRouter.get("/:id", async (req, res,next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({error: 'Please provide category id'})
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
    );
    const { 0: category} = <ApiCategory[]>query[0];

    if (!category) {
      return res.status(404).send({ error: "Not found" });
    }
    return res.send(category);
  } catch (error) {
    return next(error)
  }
});

categoriesRouter.post("/", async (req, res,next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).send({ error: 'Field "Title" is required' });
    }

    const categoryData: Category = {
      title: String(title),
      description: String(description),
    };

    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "INSERT INTO categories (title, description) VALUES (?, ?)",
        [categoryData.title, categoryData.description]
    );
    const { insertId: id } = <OkPacket>query[0];

    return res.send({ ...categoryData, id });
  } catch (error) {
    return next(error)
  }
});

categoriesRouter.delete("/:id", async (req, res,next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({ error: 'Please provide category id' })
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "SELECT * FROM records WHERE category_id = ?",
        [id]
    );
    const { 0: category} = <ApiCategory[]>query[0];

    if (category) {
      return res.status(400).send({ error: "Cannot delete a parent row" });
    }

    await connection.query("DELETE FROM categories WHERE id = ?", [id]);
    return res.send({ message: "Deleted" });
  } catch (error) {
    return next(error)
  }
});

categoriesRouter.put("/:id", async (req, res,next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({ error: 'Please provide category id' })
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).send({ error: 'Field "Title" is required' });
    }

    const categoryData: Category = {
      title: String(title),
      description: String(description),
    };

    const connection = mysqlDb.getConnection();
    await connection.query(
        "UPDATE categories SET title = ?, description = ? WHERE id = ?",
        [categoryData.title, categoryData.description, id]
    );

    return res.send({ id, ...categoryData });
  } catch (error) {
    return next(error)
  }
});

export default categoriesRouter;