import { NextFunction, Response, Request } from "express";
import { ISession } from "../models/interfaces/session.interface";
import { AsyncMiddleware } from "../types/middleware.type";
import { RouteFunction } from "../types/route.type";

export function wrapMiddleware(middleware: AsyncMiddleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export function wrapRouteFunction(routeFunction: RouteFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = JSON.parse(JSON.stringify(req.query));
      const body = req.body;
      const params = req.params;
      const response = await routeFunction({
        query,
        params,
        body,
        session: (req as Request & { session: ISession }).session,
      });
      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}

// Wrap all middlewares in an array, return wrapped array
export function wrapMiddlewares(middlewares: AsyncMiddleware[]) {
  return middlewares.map(middleware => wrapMiddleware(middleware));
}
