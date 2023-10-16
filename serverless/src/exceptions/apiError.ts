class ApiError extends Error {
  statusCode: number;
  errors: any[];
  constructor(statusCode: number, message: string, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static UnauthorizedError() {
    return new ApiError(401, "User unauthorized");
  }

  static BadRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors);
  }

  static Conflict(message: string) {
    return new ApiError(409, message);
  }
}

export default ApiError;
