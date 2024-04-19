import {Router} from "express";
import {OkPacket} from "mysql2";
import {imageUpload} from "../multer";
import mysqlDb from "../mysqlDb";
import {ApiRecord, Record} from "../types";

const recordsRouter = Router();

recordsRouter.get("/", async (_req, res, next) => {
  try {
    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "SELECT id, title, category_id, location_id FROM records"
    );
    const { 0 : records} = query;
    return  res.send(records);
  } catch (error) {
    return next(error)
  }
});

recordsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({error: 'Please provide record id'})
    }

    const connection = mysqlDb.getConnection();
    const query = await connection.query("SELECT * FROM records WHERE id = ?", [
      req.params.id,
    ]);
    const { 0: record} = <ApiRecord[]>query[0];

    if (!record) {
      return res.status(404).send({error: "Not found"});
    }

    return res.send(record);
  } catch (error) {
    return next(error)
  }
});

recordsRouter.post("/", imageUpload.single("image"), async (req, res, next) => {
  try {
    const { title, description, category_id, location_id } = req.body;

    if (!title || !category_id || !location_id) {
      return res.status(400).send({
        error: 'Fields "Title", "Category_id" and "Location_id" are required',
      });
    }

    const recordData: Record = {
      title: String(title),
      category_id: Number(category_id),
      location_id: Number(location_id),
      description: String(description),
      image: req.file ? req.file.filename : null,
    };

    const connection = mysqlDb.getConnection();
    const query = await connection.query(
        "INSERT INTO records (title, category_id, location_id, description, image, registered_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          recordData.title,
          recordData.category_id,
          recordData.location_id,
          recordData.description,
          recordData.image,
        ]
    );
    const { insertId: id } = <OkPacket>query[0];

    return res.send({ ...recordData, id });
  } catch (error) {
    return next(error)
  }
});

recordsRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({ error: 'Please provide record id' })
    }

    const connection = mysqlDb.getConnection();
    await connection.query("DELETE FROM records WHERE id = ?", [id]);
    return res.send({ message: "Deleted" });
  } catch (error) {
    return next(error)
  }
});

recordsRouter.put("/:id", imageUpload.single("image"), async (req, res, next) => {
  try {
    const { id} = req.params

    if (!id) {
      return res.status(400).send({ error: 'Please provide record id' })
    }

    const { title, description, category_id, location_id } = req.body;

    if (!title || !category_id || !location_id) {
      return res.status(400).send({
        error: 'Fields "Title", "Category_id" and "Location_id" are required',
      });
    }

    const recordData: Record = {
      title: String(title),
      category_id: Number(category_id),
      location_id: Number(location_id),
      description: String(description),
      image: req.file ? req.file.filename : null,
    };

    const connection = mysqlDb.getConnection();
    await connection.query(
        `UPDATE records SET title = ?, category_id = ?, location_id = ?, description = ?${
            recordData.image ? ", image = ?" : ""
        } WHERE id = ?`,
        [
          recordData.title,
          recordData.category_id,
          recordData.location_id,
          recordData.description,
          recordData.image,
          id,
        ].filter((value) => value !== null)
    );

    const { image, ...recordDataWithoutImage} = recordData;

    return res.send({ id, ...( !!image ? recordData : recordDataWithoutImage )});

  } catch (error) {
    return next(error)
  }
});

export default recordsRouter;