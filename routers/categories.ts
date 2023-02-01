import {Router} from "express";
import mysqlDb from "../mysqlDb";
import {ApiCategory, Category} from "../types";
import {OkPacket} from "mysql2";

const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM categories');
    const categories = query[0] as ApiCategory[]
    res.send(categories);
});

categoriesRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    const categories = query[0] as ApiCategory[]
    const category = categories[0]
    if (!category) {
        return res.status(404).send({error: 'Not found'})
    }
    res.send(category);
});

categoriesRouter.post('/', async (req, res) => {
    if (!req.body.title) {
        return res.status(404).send({error: 'Field "Title" is required'})
    }

    const categoryData: Category = {
        title: req.body.title,
        description: req.body.description,
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query('INSERT INTO categories (title, description) VALUES (?, ?)', [categoryData.title, categoryData.description]);
    const info = query[0] as OkPacket;

    res.send({...categoryData, id: info.insertId});
});

categoriesRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    await connection.query('DELETE FROM categories WHERE id = ?', [req.params.id])
    res.send('The category is deleted');
});

export default categoriesRouter;