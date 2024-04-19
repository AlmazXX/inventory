import {randomUUID} from "crypto";
import {promises as fs} from "fs";
import multer from "multer";
import path from "path";
import {publicPath} from "./config";

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(publicPath, "images");
    await fs.mkdir(destDir, { recursive: true });
    cb(null, publicPath);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, "images/" + randomUUID() + extension);
  },
});

export const imageUpload = multer({ storage: imageStorage });