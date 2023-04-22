import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { JWT_SERVICE } from "../helpers/di-names.helper";
import { ErrorCode } from "../helpers/error-codes.helper";
import { HttpException } from "../models/exceptions/http.exception";
import { IJwtData } from "../models/interfaces/jwt-data";
import { ISession } from "../models/interfaces/session.interface";
import { DependencyProviderService } from "../services/dependency-provider.service";
import { JwtSessionService } from "../services/jwt-session.service";
import { RequestWithSession } from "../types/middleware.type";

export async function authJwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISession | void> {
  const authHeader = req.get("Authorization");

  if (authHeader === undefined) {
    return next(new HttpException(ErrorCode.InvalidToken));
  }

  if (!authHeader.startsWith("Bearer"))
    return next(new HttpException(ErrorCode.InvalidToken));

  const jwtKey = authHeader.replace("Bearer ", "");
  let jwtData: IJwtData | undefined = undefined;
  try {
    jwtData = await DependencyProviderService.getImpl<JwtSessionService>(
      JWT_SERVICE
    ).verifyJwtData(jwtKey);

    z.object({
      sub: z.string().includes("|"),
      scope: z.string(),
    }).parse(jwtData);
  } catch (e: unknown) {
    return next(new HttpException(ErrorCode.TokenMalformed));
  }

  const session = {
    userId: jwtData.sub,
  } as ISession;

  (req as RequestWithSession)["session"] = session;
  return next();
}
