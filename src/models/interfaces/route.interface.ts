import { AsyncMiddleware } from "../../types/middleware.type";

export interface IRoute {
	path: string;
	method: "post" | "get" | "put" | "delete";
	func: AsyncMiddleware;
	middlewares?: AsyncMiddleware[];
}
