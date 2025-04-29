import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError";
import httpStatusText from "../utils/httpStatusText";
import { asyncWrapper } from "./asyncWrapper";

const storage = multer.diskStorage({
  destination: function (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, path.resolve(__dirname, "../../images/full"));
  },
  filename: function (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, file.originalname);
  },
});
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (file.mimetype.split("/")[0] == "image") {
    return cb(null, true);
  } else {
    return cb(new appError("Must be an img", 500, httpStatusText.FAIL));
  }
};
export const upload = multer({ storage: storage, fileFilter: fileFilter });
export const uploadMiddleware = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const multerUpload = upload.single("image");

    multerUpload(req, res, (err) => {
      if (err) {
        next(new appError("Must be an img", 500, httpStatusText.FAIL));
        return;
      }
      next();
    });
  },
);
