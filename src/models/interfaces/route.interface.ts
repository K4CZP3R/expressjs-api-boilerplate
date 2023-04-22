import { AsyncMiddleware } from "../../types/middleware.type";
import { RouteFunction } from "../../types/route.type";

export interface IRoute {
  path: string;
  method: "post" | "get" | "put" | "delete";
  func: RouteFunction;
  middlewares?: AsyncMiddleware[];
}
