import { NextFunction, Request, Response } from "express";
import { AsyncMiddleware } from "../types/middleware.type";

export function wrapMiddleware(middleware: AsyncMiddleware) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await middleware(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

// Wrap all middlewares in an array, return wrapped array
export function wrapMiddlewares(middlewares: AsyncMiddleware[]) {
	return middlewares.map(middleware => wrapMiddleware(middleware));
}
