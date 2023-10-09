class ApiError extends Error {
  status: number;
  errors: any[];
  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.status = status;
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
