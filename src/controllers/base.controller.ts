import { Router } from "express";
import {
  wrapMiddlewares,
  wrapRouteFunction,
} from "../helpers/middleware.helper";
import { IController } from "../models/interfaces/controller.interface";
import { IRoute } from "../models/interfaces/route.interface";
import { AsyncMiddleware } from "../types/middleware.type";

export class BaseController implements IController {
  router: Router = Router();
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  initialize(routes: IRoute[], middlewares: AsyncMiddleware[]): void {
    routes.forEach(route => {
      if (!route.method || !route.path) {
        console.warn("Invalid route", route, "in path", this.path, "ignoring!");
        return;
      }

      const wrapped = wrapMiddlewares([
        ...middlewares,
        ...(route.middlewares ?? []),
      ]);
      this.router[route.method](
        route.path,
        wrapped,
        wrapRouteFunction(route.func)
      );
    });
  }
}
