// import * as jwt from "jsonwebtoken";
import * as jose from "jose";
import { ISession } from "../models/interfaces/session.interface";

export class JwtSessionService {
	private JWKS;
	constructor(
		private config: {
			jwkEndpoint: string;
			issuer: string;
		}
	) {
		this.JWKS = jose.createRemoteJWKSet(new URL(this.config.jwkEndpoint));
	}

	getIssuer(): string {
		return this.config.issuer;
	}

	async verifySession(key: string): Promise<ISession> {
		const { payload } = await jose.jwtVerify(key, this.JWKS, {
			issuer: this.config.issuer,
		});

		return payload.session as ISession;
	}
}
