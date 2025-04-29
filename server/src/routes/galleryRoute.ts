import express from "express";
import {
  resizeImage,
  uploadImg,
  getAllImages,
} from "../controllers/galleryController";
import { uploadMiddleware } from "../middleware/upload";
const router = express.Router();
router.route("/image-list").get(getAllImages);
router.route("/:fileName").get(resizeImage);
router.route("/upload").post(uploadMiddleware, uploadImg);
export default router;
