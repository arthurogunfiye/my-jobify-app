import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import cloudinary from 'cloudinary';

import jobRouter from './routes/jobs.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import errorHandlerMiddleware from './middleware/errorHandler.middleware.js';
import { authenticateUser } from './middleware/auth.middleware.js';

const app = express();

const PORT = process.env.PORT || 5100;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.resolve(__dirname, './public')));
app.use(cookieParser());
app.use(express.json());

// Testing route

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is healthy' });
});

// Routes
app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

// Handle undefined routes - Not Found middleware
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'This route does not exist!',
    success: false
  });
});

// Global error handler - Error handling middleware
app.use(errorHandlerMiddleware);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
