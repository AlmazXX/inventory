import {Router} from "express";
import {OkPacket} from "mysql2";
import mysqlDb from "../mysqlDb";
import {ApiLocation, Location} from "../types";

const locationsRouter = Router();

locationsRouter.get("/", async (_req, res, next) => {
  try {
    const connection = mysqlDb.getConnection();
    const query = await connection.query("SELECT id, title FROM locations");
    const { 0: locations} = query
    return res.send(locations);
  } catch (error) {
    return next(error)
  }
});

locationsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({error: 'Please provide location id'})
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query("SELECT * FROM locations WHERE id = ?", [id]);
    const { 0: location} = <ApiLocation[]>query[0];

    if (!location) {
      return res.status(404).send({error: "Not found"});
    }
    return res.send(location);
  } catch (error) {
    return next(error)
  }
});

locationsRouter.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).send({ error: 'Field "Title" is required' });
    }

    const locationData: Location = {
      title: String(title),
      description: String(description),
    };

    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "INSERT INTO locations (title, description) VALUES (?, ?)",
        [locationData.title, locationData.description]
    );
    const { insertId: id} = <OkPacket>query[0];

    return res.send({...locationData, id });
  } catch (error) {
    return next(error)
  }
});

locationsRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({ error: 'Please provide location id' })
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "SELECT * FROM records WHERE location_id = ?",
        [id]
    );
    const { 0: location } = <ApiLocation[]>query[0];

    if (location) {
      return res.status(400).send({ error: "Cannot delete a parent row " });
    }

    await connection.query("DELETE FROM locations WHERE id = ?", [id]);
    return  res.send({ message: "Deleted" });
  } catch (error) {
    return next(error)
  }
});

locationsRouter.put("/:id", async (req, res, next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({ error: 'Please provide category id' })
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).send({error: 'Field "Title" is required'});
    }

    const locationData: Location = {
      title: String(title),
      description: String(description),
    };

    const connection = mysqlDb.getConnection();
    await connection.query(
        "UPDATE locations SET title = ?, description = ? WHERE id = ?",
        [locationData.title, locationData.description, req.params.id]
    );

    return  res.send({ id, ...locationData });
  } catch (error) {
    return next(error)
  }
});

export default locationsRouter;