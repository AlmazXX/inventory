import {Router} from "express";
import mysqlDb from "../mysqlDb";
import {Category} from "../types";
import {OkPacket} from "mysql2";

const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM categories');
    const products = query[0] as Category[]
    res.send(products);
});

categoriesRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    const products = query[0] as Category[]
    const product = products[0]
    if (!product) {
        return res.status(404).send({error: 'Not found'})
    }
    res.send(product);
});

categoriesRouter.post('/', async (req, res) => {
    if (!req.body.title) {
        return res.status(404).send({error: 'Field "Title" is required'})
    }

    const categoryData = {
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