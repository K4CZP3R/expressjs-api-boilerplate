import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { ISession } from "../models/interfaces/session.interface";

export class JwtSessionService {
	constructor(private config: { privateKey: string; publicKey: string; expiresIn: number; issuer: string }) {}

	signSession(session: ISession): string {
		return jwt.sign(session, this.config.privateKey, {
			algorithm: "RS512",
			expiresIn: this.config.expiresIn,
			issuer: this.config.issuer,
		});
	}

	verifySession(key: string): ISession {
		return jwt.verify(key, this.config.publicKey, {
			algorithms: ["RS512"],
			ignoreExpiration: false,
			issuer: this.config.issuer,
		}) as ISession;
	}
}
