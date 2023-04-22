import { Request, Response, NextFunction } from "express";
import { ISession } from "../models/interfaces/session.interface";

export type Middleware = (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => void | Response<unknown, Record<string, unknown>>;

export type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  | Promise<void>
  | Promise<Response<unknown, Record<string, unknown>>>
  | Promise<unknown>;

export type RequestWithSession = Request & { session: ISession };
