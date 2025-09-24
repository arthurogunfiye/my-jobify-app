import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthorisedError } from '../errors/customErrors.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors.array().map(error => error.msg);

  if (errorMessages[0].startsWith('No job with id'))
    throw new NotFoundError(errorMessages);

  if (errorMessages[0].startsWith('You do not have permission'))
    throw new UnauthorisedError(
      'You do not have permission to access this resource'
    );

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: errorMessages.join(', ') });
};

export default validate;
