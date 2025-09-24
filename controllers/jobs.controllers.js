import 'express-async-errors';
import Job from '../models/job.model.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';

// Get all jobs
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId
  };

  if (search) {
    queryObject.$or = [
      {
        position: { $regex: search, $options: 'i' }
      },
      {
        jobLocation: { $regex: search, $options: 'i' }
      },
      {
        company: { $regex: search, $options: 'i' }
      }
    ];
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position'
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    message: 'Jobs retrieved successfully',
    totalJobs: totalJobs,
    numberOfPages: numOfPages,
    currentPage: page,
    jobs: jobs,
    success: true
  });
};

// Create job
export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: 'Job created successfully',
    job: job,
    success: true
  });
};

// Get a specific job by ID
export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  res.status(StatusCodes.OK).json({
    message: 'Job retrieved successfully',
    job: job,
    success: true
  });
};

// Edit a job
export const updateJob = async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  res.status(StatusCodes.OK).json({
    message: 'Job updated successfully',
    success: true,
    job: updatedJob
  });
};

// Delete a job
export const deleteJob = async (req, res) => {
  const removedJob = await Job.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({
    message: 'job deleted successfully',
    success: true,
    job: removedJob
  });
};

// Show stats
export const showStats = async (req, res) => {
  // Aggregate stats
  // 1. Match (filter) - Get all jobs created by the user
  // 2. Group - Group the jobs by status and count them
  // 3. Sort - Sort the results by status
  // 4. Reduce - Transform the array into an object with default values for each status
  // 5. Monthly Applications - Get the number of applications per month for the last 6 months
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } }
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
    offer: stats.offer || 0,
    hired: stats.hired || 0
  };

  // Monthly Applications
  // 1. Match (filter) - Get all jobs created by the user
  // 2. Group - Group the jobs by year and month and count them
  // 3. Sort - Sort the results by year and month in descending order
  // 4. Limit - Limit the results to the last 6 months
  // 5. Map - Transform the results to include a formatted date
  // 6. Reverse - Reverse the array to have the oldest month first

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 }
  ]);

  monthlyApplications = monthlyApplications
    .map(item => {
      const {
        _id: { year, month },
        count
      } = item;
      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({
    message: 'stats retrieved successfully',
    success: true,
    data: { defaultStats, monthlyApplications }
  });
};
