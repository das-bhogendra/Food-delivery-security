import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folder exists
const uploadPath = path.join(__dirname, "../../public/food_photos");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

export const foodUpload = multer({ storage });
