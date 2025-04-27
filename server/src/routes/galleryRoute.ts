import express from "express";
import {
  resizeImage,
  uploadImg,
  getAllImages,
} from "../controllers/galleryController";
import { upload } from "../middleware/upload";
const router = express.Router();
router.route("/image-list").get(getAllImages);
router.route("/:fileName").get(resizeImage);
router.route("/upload").post(upload.single("image"), uploadImg);
export default router;
