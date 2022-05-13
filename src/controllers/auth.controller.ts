import { NextFunction, Response, Request } from "express";
import { checkValues } from "../helpers/type-checker.helper";
import { AuthLogic } from "../logic/auth.logic";
import { authUserMiddleware } from "../middlewares/auth.middleware";
import { IRoute } from "../models/interfaces/route.interface";
import { BaseController } from "./base.controller";

export class AuthController extends BaseController {
	routes: IRoute[] = [
		{
			path: "/me",
			method: "GET",
			func: this.pathMe.bind(this),
			middlewares: [authUserMiddleware],
		},
	];

	constructor(private authLogic: AuthLogic = new AuthLogic()) {
		super({ path: "/auth" });
		this.loadRoutes();
	}

	async pathMe(req: Request, res: Response, next: NextFunction) {
		let result = await this.authLogic.meData({ user: req["user"] });
		res.json(result);
	}
}
