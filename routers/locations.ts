import {Router} from "express";
import mysqlDb from "../mysqlDb";
import {Category, Location} from "../types";
import {OkPacket} from "mysql2";

const locationsRouter = Router();

locationsRouter.get('/', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM locations');
    const locations = query[0] as Location[]
    res.send(locations);
});

locationsRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const query = await connection.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    const locations = query[0] as Category[]
    const location = locations[0]
    if (!location) {
        return res.status(404).send({error: 'Not found'})
    }
    res.send(location);
});

locationsRouter.post('/', async (req, res) => {
    if (!req.body.title) {
        return res.status(404).send({error: 'Field "Title" is required'})
    }

    const locationData = {
        title: req.body.title,
        description: req.body.description,
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query('INSERT INTO locations (title, description) VALUES (?, ?)', [locationData.title, locationData.description]);
    const info = query[0] as OkPacket;

    res.send({...locationData, id: info.insertId});
});

locationsRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    await connection.query('DELETE FROM locations WHERE id = ?', [req.params.id])
    res.send('The location is deleted');
});

export default locationsRouter;