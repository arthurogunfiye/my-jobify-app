import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { generateToken, setJWTInCookie } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  const isFirstUser = (await User.countDocuments()) === 0;
  req.body.role = isFirstUser ? 'admin' : 'user';
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: 'User registered successfully',
    success: true
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const isValidUser = user && (await user.comparePassword(password));

  if (!isValidUser) throw new UnauthenticatedError('Invalid Credentials');

  const token = generateToken({ userId: user._id, role: user.role });

  setJWTInCookie(res, token);

  res.status(StatusCodes.OK).json({ message: 'User logged in successfully' });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  });
  res.status(StatusCodes.OK).json({ message: 'User logged out successfully' });
};
