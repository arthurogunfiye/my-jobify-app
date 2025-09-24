import { body, param } from 'express-validator';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from '../models/job.model.js';
import User from '../models/user.model.js';
import { BadRequestError, UnauthorisedError } from '../errors/customErrors.js';

export const jobValidationRules = () => {
  return [
    body('company')
      .notEmpty()
      .withMessage('Company is required')
      .isString()
      .withMessage('Company should be a string')
      .trim(),
    body('position')
      .notEmpty()
      .withMessage('Position is required')
      .isString()
      .withMessage('Position should be a string')
      .trim(),
    body('jobLocation')
      .notEmpty()
      .withMessage('Job location is required')
      .isString()
      .withMessage('Job location should be a string')
      .trim(),
    body('jobStatus')
      .isIn(Object.values(JOB_STATUS))
      .withMessage('Invalid job status value'),
    body('jobType')
      .isIn(Object.values(JOB_TYPE))
      .withMessage('Invalid job type value')
  ];
};

export const validateRegisterInput = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name should be a string')
      .trim(),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isString()
      .withMessage('Email should be a string')
      .isEmail()
      .withMessage('Invalid email format')
      .custom(async email => {
        const user = await User.findOne({ email });
        if (user) {
          throw new BadRequestError('Email already in use');
        }
      }),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isString()
      .withMessage('Password should be a string')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('lastName')
      .notEmpty()
      .withMessage('LastName is required')
      .isString()
      .withMessage('LastName should be a string')
      .trim(),
    body('location')
      .notEmpty()
      .withMessage('Location is required')
      .isString()
      .withMessage('Location should be a string')
      .trim()
  ];
};

export const validateLoginInput = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
  ];
};

export const validateIdParam = () => {
  return [
    param('id').custom(async (value, { req }) => {
      const isValidId = mongoose.Types.ObjectId.isValid(value);

      if (!isValidId) throw new Error('Invalid MongoDB ID');

      const job = await Job.findById(value);

      if (!job) throw new Error(`No job with id: ${value}`);

      const isAdmin = req.user.role === 'admin';
      const isOwnerOfJob = job.createdBy.toString() === req.user.userId;

      if (!isAdmin && !isOwnerOfJob)
        throw new UnauthorisedError(
          'You do not have permission to access this resource'
        );
    })
  ];
};

export const validateUpdateUserInput = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name should be a string')
      .trim(),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isString()
      .withMessage('Email should be a string')
      .isEmail()
      .withMessage('Invalid email format')
      .custom(async (email, { req }) => {
        const user = await User.findOne({ email });
        if (user && user._id.toString() !== req.user.userId) {
          throw new BadRequestError('Email already in use');
        }
      }),
    body('lastName')
      .notEmpty()
      .withMessage('LastName is required')
      .isString()
      .withMessage('LastName should be a string')
      .trim(),
    body('location')
      .notEmpty()
      .withMessage('Location is required')
      .isString()
      .withMessage('Location should be a string')
      .trim(),
    body('role')
      .not()
      .exists()
      .withMessage('Role cannot be updated by the user')
  ];
};
