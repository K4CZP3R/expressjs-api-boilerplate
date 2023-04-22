import { Router } from "express";
import { AsyncMiddleware } from "../../types/middleware.type";
import { IRoute } from "./route.interface";

export interface IController {
  router: Router;
  path: string;

  initialize(routes: IRoute[], middlewares: AsyncMiddleware[]): void;
}
