import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { appError } from "../utils/appError";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import httpStatusText from "../utils/httpStatusText";
export const resizeImage = asyncWrapper(
  async (
    req: Request<ParamsDictionary, unknown, unknown, ParsedQs>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { fileName } = req.params;
    const width = parseInt(req.query.width as string);
    const height = parseInt(req.query.height as string);
    const inputPath = path.join(
      __dirname,
      "..",
      "..",
      "images",
      "full",
      `${fileName}`,
    );
    const outputPath = path.join(
      __dirname,
      "..",
      "..",
      "images",
      "thumb",
      `${width}x${height}-${fileName}`,
    );

    if (!width || !height) {
      return res.sendFile(inputPath);
    }
    if (fs.existsSync(outputPath)) {
      return res.sendFile(outputPath);
    }
    try {
      await resize(inputPath, outputPath, width, height);
      res.sendFile(outputPath, (err) => {
        if (err) {
          next(new appError("Failed to send file", 500, httpStatusText.FAIL));
        }
      });
    } catch (error) {
      if (error instanceof appError) {
        return next(error);
      }
      new appError("Image processing failed.", 500, httpStatusText.FAIL);
    }
  },
);
export const resize = async (
  inputPath: string,
  outputPath: string,
  width: number,
  height: number,
): Promise<void> => {
  if (!fs.existsSync(inputPath)) {
    throw new appError("Input file does not exist", 400, httpStatusText.FAIL);
  }
  if (width <= 0 || height <= 0) {
    throw new appError("Invalid dimensions", 400, httpStatusText.FAIL);
  }
  try {
    await sharp(inputPath).resize(width, height).toFile(outputPath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new appError(error.message, 500, httpStatusText.FAIL);
    }
  }
};
export const uploadImg = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file) {
      return next(new appError("No file uploaded", 400, httpStatusText.FAIL));
    }

    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "Image uploaded successfully",
      filename: req.file.filename,
    });
  },
);
export const getAllImages = asyncWrapper(
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    fs.readdir(path.join(process.cwd(), "images", "full"), (err, files) => {
      if (err)
        return next(
          new appError("Failed to read folder", 500, httpStatusText.FAIL),
        );
      res.json(files);
    });
  },
);
