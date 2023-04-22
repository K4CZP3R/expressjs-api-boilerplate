import {
  ErrorCode,
  errorsMap,
  unknownError,
} from "../../helpers/error-codes.helper";

export class HttpException extends Error {
  public message: string;
  public solution: string;
  public errorCode: ErrorCode;
  public httpErrorCode: number;

  constructor(errorCode: ErrorCode) {
    const info = errorsMap.get(errorCode) ?? unknownError;
    super(info.error);

    this.message = info.error;
    this.solution = info.solution;
    this.errorCode = errorCode;
    this.httpErrorCode = info.httpErrorCode;
  }
}
