import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorisedError
} from '../errors/customErrors.js';
import { verifyToken } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError('Authentication invalid');

  try {
    const { userId, role } = verifyToken(token);
    const testUser = userId === '68c4904b91e4d35023f601be';
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export const authorisePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorisedError(
        'You do not have permission to access this route'
      );
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Demo user. Read only access!');
  }
  next();
};
