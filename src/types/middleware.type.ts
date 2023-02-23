import { Request, Response, NextFunction } from "express";

export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;

export type AsyncMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> | Promise<Response<any, Record<string, any>>> | Promise<unknown>;

export type AsyncMiddlewareWithSession = (req: RequestWithSession, res: Response, next: NextFunction) => Promise<void>;

export type RequestWithSession = Request & { session: unknown };
