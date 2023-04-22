export enum ErrorCode {
  InvalidToken = 1000,
  TokenMalformed = 1001,
  InternalServerError = 1002,
  UserNotFound = 1003,
  MissingContextUserId = 1004,
  NoRights = 1005,
}

export enum HttpErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
}

export const unknownError = {
  error: "Something went wrong.",
  solution: "Something went wrong.",
  httpErrorCode: HttpErrorCode.InternalServerError,
};

// Create map of error codes to solutions
export const errorsMap = new Map<
  ErrorCode,
  { error: string; solution: string; httpErrorCode: HttpErrorCode }
>([
  [
    ErrorCode.TokenMalformed,
    {
      error: "Token malformed.",
      solution: "Reauthenticate.",
      httpErrorCode: HttpErrorCode.Unauthorized,
    },
  ],
  [
    ErrorCode.InvalidToken,
    {
      error: "Invalid token.",
      solution: "For security reasons, please reauthenticate.",
      httpErrorCode: HttpErrorCode.Forbidden,
    },
  ],

  [
    ErrorCode.UserNotFound,
    {
      error: "User not found.",
      solution: "User not found.",
      httpErrorCode: HttpErrorCode.NotFound,
    },
  ],

  [
    ErrorCode.MissingContextUserId,
    {
      error: "Missing user context.",
      solution: "Try again later.",
      httpErrorCode: HttpErrorCode.InternalServerError,
    },
  ],
  [
    ErrorCode.NoRights,
    {
      error: "No rights.",
      solution: "You don't have the rights to do this.",
      httpErrorCode: HttpErrorCode.Forbidden,
    },
  ],

  [
    ErrorCode.InternalServerError,
    {
      error: "Internal server error.",
      solution: "Try again later.",
      httpErrorCode: HttpErrorCode.InternalServerError,
    },
  ],
]);
