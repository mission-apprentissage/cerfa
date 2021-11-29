class ApiError extends Error {
  constructor(apiName, message, reason) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.apiName = apiName;
    this.message = `[${apiName}] ${message}`;
    this.reason = reason;
  }
}

module.exports = ApiError;
