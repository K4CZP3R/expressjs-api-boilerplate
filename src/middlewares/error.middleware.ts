import { NextFunction, Request, Response } from "express";
import { HttpException } from "../models/exceptions/http.exception";
import { ErrorCode } from "../helpers/error-codes.helper";

export function errorMiddleware(
  error: HttpException | unknown,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (response.headersSent) {
    console.warn("Headers already sent, cannot send error response", error);
    return;
  }
  if (error instanceof HttpException) {
    response.status(error.httpErrorCode).send({
      error: error.message,
      solution: error.solution,
      errorCode: error.errorCode,
    });
  } else {
    errorMiddleware(
      new HttpException(ErrorCode.InternalServerError),
      request,
      response,
      _next
    );
  }
}
