import {Router} from "express";
import mysqlDb from "../mysqlDb";
import {ApiRecord, Record} from "../types";
import {imageUpload} from "../multer";
import {OkPacket} from "mysql2";

const recordsRouter = Router();

recordsRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM records');
    const records = query[0] as ApiRecord[];
    res.send(records)
});

recordsRouter.get('/:id',async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
    const records = query[0] as ApiRecord[];
    const record = records[0];
    if (!record) {
        return res.status(404).send({error: 'Not found'})
    }
    res.send(record);
});

recordsRouter.post('/', imageUpload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.category_id || !req.body.location_id) {
        return res.status(404).send({error: 'Fields "Title", "Category_id" and "Location_id" are required'});
    }
    const recordData: Record = {
        title: req.body.title,
        category_id: req.body.category_id,
        location_id: req.body.location_id,
        description: req.body.description,
        image: req.file ? req.file.filename : null,
        registered_at: new Date(),
    };

    const connection = mysqlDb.getConnection();
    const query = await connection.query('INSERT INTO records (title, category_id, location_id, description, image, registered_at) VALUES (?, ?, ?, ?, ?, ?)', [recordData.title, recordData.category_id, recordData.location_id, recordData.description, recordData.image, recordData.registered_at]);
    const info = query[0] as OkPacket;

    res.send({...recordData, id: info.insertId});
});

recordsRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    await connection.query('DELETE FROM records WHERE id = ?', [req.params.id]);
    res.send('The record was deleted')
});

export default recordsRouter;