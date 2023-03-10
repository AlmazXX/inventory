import { Router } from "express";
import { OkPacket } from "mysql2";
import { imageUpload } from "../multer";
import mysqlDb from "../mysqlDb";
import { ApiRecord, Record } from "../types";

const recordsRouter = Router();

recordsRouter.get("/", async (req, res) => {
  const connection = mysqlDb.getConnection();
  const query = await connection.query(
    "SELECT id, title, category_id, location_id FROM records"
  );
  const records = query[0] as ApiRecord[];
  res.send(records);
});

recordsRouter.get("/:id", async (req, res) => {
  const connection = mysqlDb.getConnection();
  const query = await connection.query("SELECT * FROM records WHERE id = ?", [
    req.params.id,
  ]);
  const [record] = query[0] as ApiRecord[];

  if (!record) {
    return res.status(404).send({ error: "Not found" });
  }
  res.send(record);
});

recordsRouter.post("/", imageUpload.single("image"), async (req, res) => {
  if (!req.body.title || !req.body.category_id || !req.body.location_id) {
    return res.status(404).send({
      error: 'Fields "Title", "Category_id" and "Location_id" are required',
    });
  }
  const recordData: Record = {
    title: req.body.title,
    category_id: req.body.category_id,
    location_id: req.body.location_id,
    description: req.body.description,
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
  const info = query[0] as OkPacket;

  res.send({ ...recordData, id: info.insertId });
});

recordsRouter.delete("/:id", async (req, res) => {
  const connection = mysqlDb.getConnection();
  await connection.query("DELETE FROM records WHERE id = ?", [req.params.id]);
  res.send({ message: "Deleted" });
});

recordsRouter.put("/:id", imageUpload.single("image"), async (req, res) => {
  if (!req.body.title || !req.body.category_id || !req.body.location_id) {
    return res.status(404).send({
      error: 'Fields "Title", "Category_id" and "Location_id" are required',
    });
  }
  const recordData: Record = {
    title: req.body.title,
    category_id: req.body.category_id,
    location_id: req.body.location_id,
    description: req.body.description,
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
      req.params.id,
    ].filter((value) => value !== null)
  );

  const { image, ...recordDataWithoutImage } = recordData;
  if (recordData.image) {
    res.send({ id: req.params.id, ...recordData });
  } else {
    res.send({ id: req.params.id, ...recordDataWithoutImage });
  }
});

export default recordsRouter;