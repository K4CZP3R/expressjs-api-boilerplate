import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { ISession } from "../models/interfaces/session.interface";
import axios from "axios";
import { IResult } from "../models/interfaces/result.interface";
import { stringify } from "querystring";

export class JwtSessionService {
	constructor(private config: { publicKey: string; issuer: string }) {}

	verifySession(key: string): ISession {
		return jwt.verify(key, this.config.publicKey, {
			algorithms: ["RS512"],
			ignoreExpiration: false,
			issuer: this.config.issuer,
		}) as ISession;
	}

	static async getJwks(endpoint: string): Promise<{ pubKey: string; issuer: string } | undefined> {
		try {
			let response = await axios.get<IResult<{ pubKey: string; issuer: string }>>(endpoint);
			return response.data.data;
		} catch (e: any) {
			return undefined;
		}
	}
}
