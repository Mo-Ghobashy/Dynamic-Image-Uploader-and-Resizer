import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import galleryRouter from "./routes/galleryRoute";
import httpStatusText from "./utils/httpStatusText";
import { appError } from "./utils/appError";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/images", galleryRouter);
app.all("*", (_req: Request, res: Response) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    message: "this route does not exist",
  });
});
app.use((error: appError, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode,
  });
});
app.listen(port || 3000, () => {
  console.log(`server started at port ${port}`);
});
export default app;
