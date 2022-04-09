import { Router, Request, Response, NextFunction } from "express";
import { JWT_SERVICE } from "../helpers/di-names.helper";
import { HttpException } from "../models/exceptions/http.exception";
import { ISession } from "../models/interfaces/session.interface";
import { UserRepository } from "../repositories/user.repository";
import { DependencyProviderService } from "../services/dependency-provider.service";
import { JwtSessionService } from "../services/jwt-session.service";

export function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
	let authHeader = req.get("Authorization");

	if (authHeader === undefined) {
		return next(new HttpException(401, "Unauthorized!"));
	}

	if (!authHeader.startsWith("Bearer")) return next(new HttpException(401, "Invalid authorization!"));

	let jwtKey = authHeader.replace("Bearer ", "");

	let session: ISession = undefined;
	try {
		session = DependencyProviderService.getImpl<JwtSessionService>(JWT_SERVICE).verifySession(jwtKey);
	} catch (e: any) {
		return next(new HttpException(401, "Token malformed! " + e.message));
	}
	req["userSession"] = session;
	new UserRepository()
		.getUserById(session.id)
		.then(user => {
			req["user"] = user;
			return next();
		})
		.catch(e => {
			return next(new HttpException(500, "something went wrong!"));
		});
}
