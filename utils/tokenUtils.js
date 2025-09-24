import jwt from 'jsonwebtoken';

export const generateToken = payload => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

export const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const setJWTInCookie = (res, token) => {
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    expires: new Date(Date.now() + oneDay)
  });
};
