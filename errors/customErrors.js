import { StatusCodes } from 'http-status-codes';

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthenticatedError';
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class UnauthorisedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorisedError';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export class MethodNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MethodNotAllowedError';
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
  }
}

export class TooManyRequestsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TooManyRequestsError';
    this.statusCode = StatusCodes.TOO_MANY_REQUESTS;
  }
}
