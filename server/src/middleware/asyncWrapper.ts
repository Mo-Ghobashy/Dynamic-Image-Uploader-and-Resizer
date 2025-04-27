import { Request, Response, NextFunction } from "express";

export const asyncWrapper = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void | Response>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
