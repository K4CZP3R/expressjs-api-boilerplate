// import * as jwt from "jsonwebtoken";
import * as jose from "jose";
import { ErrorCode } from "../helpers/error-codes.helper";
import { HttpException } from "../models/exceptions/http.exception";
import { IJwtData } from "../models/interfaces/jwt-data";

export class JwtSessionService {
  private JWKS;
  constructor(
    private config: {
      jwkEndpoint: string;
      audience: string;
      scopes: string[];
    }
  ) {
    this.JWKS = jose.createRemoteJWKSet(new URL(this.config.jwkEndpoint));
  }

  getIssuer(): string {
    return this.config.audience;
  }

  async verifyJwtData(key: string): Promise<IJwtData> {
    const { payload } = await jose.jwtVerify(key, this.JWKS, {
      audience: this.config.audience,
    });

    const returnPayload = payload as unknown as IJwtData;

    // verify that all scopes are present
    if (
      !this.config.scopes.every(scope =>
        returnPayload.scope.split(" ").includes(scope)
      )
    ) {
      throw new HttpException(ErrorCode.InvalidToken);
    }

    return returnPayload;
  }
}
