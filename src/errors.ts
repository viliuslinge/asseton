type IServerApiErrorCode =
  | "provider-not-found"
  | "authentication-exists"
  | "authentication-not-found"
  | "authentication-required"
  | "authentication-not-required";

interface IServerApiErrorInput {
  code: IServerApiErrorCode;
  statusCode: number;
  message: string;
}

export class ServerApiError extends Error {
  code: IServerApiErrorCode;
  statusCode: number;

  constructor(input: IServerApiErrorInput) {
    super(input.message);

    this.code = input.code;
    this.statusCode = input.statusCode;

    Object.setPrototypeOf(this, ServerApiError.prototype);
  }

  static AuthenticationExists() {
    return new ServerApiError({
      code: "authentication-exists",
      statusCode: 401,
      message: "Authentication exists",
    });
  }

  static AuthenticationNotFound() {
    return new ServerApiError({
      code: "authentication-not-found",
      statusCode: 404,
      message: "Authentication not found",
    });
  }

  static AuthenticationRequired() {
    return new ServerApiError({
      code: "authentication-required",
      statusCode: 403,
      message: "Authentication required",
    });
  }

  static AuthenticationNotRequired() {
    return new ServerApiError({
      code: "authentication-not-required",
      //TODO: whats the code?
      statusCode: 401,
      message: "Authentication not required",
    });
  }

  static ProviderNotFound() {
    return new ServerApiError({
      code: "provider-not-found",
      statusCode: 404,
      message: "Provider not found",
    });
  }

  static Custom(input: IServerApiErrorInput) {
    return new ServerApiError(input);
  }
}
