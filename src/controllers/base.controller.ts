import { Router } from "express";
import { wrapMiddleware, wrapMiddlewares } from "../helpers/middleware.helper";
import { IController } from "../models/interfaces/controller.interface";
import { IRoute } from "../models/interfaces/route.interface";
import { AsyncMiddleware } from "../types/middleware.type";

export class BaseController implements IController {
	path: string;
	middlewares?: AsyncMiddleware[];
	router: Router = Router();
	routes: IRoute[] = [];

	constructor(config: { path: string; middlewares?: AsyncMiddleware[] }) {
		this.path = config.path;
		this.middlewares = config.middlewares;
	}

	loadRoutes(): void {
		this.routes.forEach(route => {
			if (!route.method) {
				console.log("Invalid route", route, "in path", this.path, "ignoring!");
				return;
			}
			const wrapped = wrapMiddlewares([...(this.middlewares ?? []), ...(route.middlewares ?? [])]);
			this.router[route.method](route.path, wrapped, wrapMiddleware(route.func));
		});
	}
}
