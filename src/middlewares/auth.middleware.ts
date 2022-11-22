import { IUser } from './../models/user.model';
import { ApiKeyAuthService } from './../services/api-key-auth.service';
import { Router, Request, Response, NextFunction } from "express";
import { API_KEY_AUTH_SERVICE, JWT_SERVICE } from "../helpers/di-names.helper";
import { AccountType } from "../models/enums/account-type.enum";
import { HttpException } from "../models/exceptions/http.exception";
import { ISession } from "../models/interfaces/session.interface";
import { UserRepository } from "../repositories/user.repository";
import { DependencyProviderService } from "../services/dependency-provider.service";
import { JwtSessionService } from "../services/jwt-session.service";

function requestedAuthMethod(req: Request): "api-key" | "jwt" {
	let authHeader = req.get("Authorization");
	let apiKey = req.get("X-Api-Key");

	if (authHeader === undefined && apiKey === undefined) {
		throw new HttpException(401, "Unauthorized");
	}

	return authHeader ? "jwt" : "api-key";



}

async function authApiKeyMiddleware(req: Request, res: Response, next: NextFunction): Promise<void | IUser> {
	let apiKey = req.get("X-Api-Key");

	if (apiKey === undefined) {
		return next(new HttpException(401, "Unauthorized!"));
	}

	let user: IUser = undefined;
	try {
		let result = await DependencyProviderService.getImpl<ApiKeyAuthService>(API_KEY_AUTH_SERVICE).validate({ apiKey });
		user = result.data.user;
	} catch (e: any) {
		return next(new HttpException(401, "Unauthorized!"));
	}

	if (!user) {
		return next(new HttpException(401, "Unauthorized!"));
	}
	return user;
}

async function authJwtMiddleware(req: Request, res: Response, next: NextFunction): Promise<ISession | void> {
	let authHeader = req.get("Authorization");

	if (authHeader === undefined) {
		return next(new HttpException(401, "Unauthorized!"));
	}

	if (!authHeader.startsWith("Bearer")) return next(new HttpException(401, "Invalid authorization!"));

	let jwtKey = authHeader.replace("Bearer ", "");
	let session: ISession = undefined;
	try {
		session = await DependencyProviderService.getImpl<JwtSessionService>(JWT_SERVICE).verifySession(jwtKey);
	} catch (e: any) {
		return next(new HttpException(401, "Token malformed! " + e.message));
	}

	if (!session) return next(new HttpException(401, "Unauthorized!"));
	return session;
}

export async function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
	if (req["user"]) {
		return next();
	}

	let reqType = requestedAuthMethod(req);

	let userId: string = undefined;
	switch (reqType) {
		case "api-key":
			const user = await authApiKeyMiddleware(req, res, next);
			if (user) {
				userId = user._id!
			}
			break;
		case "jwt":
			const session = await authJwtMiddleware(req, res, next);
			if (session) {
				if (session.type !== "user") {
					return next(new HttpException(401, "Invalid token type!"));
				}
				userId = session.id;
			}
			break;
	}

	if (userId === undefined) {
		return next(new HttpException(401, "Unauthorized!"));
	}


	new UserRepository()
		.getById(userId)
		.then(user => {
			req["user"] = user;
			return next();
		})
		.catch(e => {
			return next(new HttpException(500, "something went wrong!"));
		});
}
export async function authRefreshMiddleware(req: Request, res: Response, next: NextFunction) {
	const session = await authJwtMiddleware(req, res, next);
	if (typeof session === "undefined") return;

	if (session.type !== "refresh") {
		return next(new HttpException(401, "Invalid token type!"));
	}
	new UserRepository()
		.getById(session.id)
		.then(user => {
			req["user"] = user;
			return next();
		})
		.catch(e => {
			return next(new HttpException(500, "something went wrong!"));
		});
}


export function authUserTypeMiddleware(accountType: AccountType) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (!req['user']) return next(new HttpException(500, "Something went wrong!"));

		if (req['user'].accountType !== accountType) {
			return next(new HttpException(401, "Unauthorized!"));
		}

		return next();
	}

}