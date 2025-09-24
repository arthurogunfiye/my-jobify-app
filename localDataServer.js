import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import { nanoid } from 'nanoid';

import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5100;

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const dataFilePath = path.join(__dirname, 'jobs.json');

const readJobsFromFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeJobsToFile = async jobs => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(jobs));
  } catch (error) {
    console.error(error);
  }
};

let jobsList = await readJobsFromFile();

// Routes
// Get all jobs
app.get('/api/v1/jobs', (req, res) => {
  res.status(200).json({
    message: 'Jobs retrieved successfully',
    data: jobsList,
    success: true
  });
});

// Get a specific job by ID
app.get('/api/v1/jobs/:id', (req, res) => {
  const { id } = req.params;
  const job = jobsList.find(job => job.id === id);
  if (!job) {
    return res.status(404).json({
      message: 'Job not found',
      success: false
    });
  }
  res.status(200).json({
    message: 'Job retrieved successfully',
    data: job,
    success: true
  });
});

// Create a new job
app.post('/api/v1/jobs', async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    return res.status(400).json({
      message: 'Position and company are required',
      success: false
    });
  }
  const newJob = { id: nanoid(10), position, company };
  jobsList = [...jobsList, newJob];
  await writeJobsToFile(jobsList);

  res.status(201).json({
    message: 'Job created successfully',
    data: newJob,
    success: true
  });
});

// Update a job by ID
app.patch('/api/v1/jobs/:id', async (req, res) => {
  const { company, position } = req.body;
  const { id } = req.params;

  if (!company || !position) {
    return res.status(400).json({
      message: 'Position and company are required',
      success: false
    });
  }

  const job = jobsList.find(job => job.id === id);

  if (!job) {
    return res.status(404).json({
      message: `Job not found with id: ${id}`,
      success: false
    });
  }

  job.company = company;
  job.position = position;

  jobsList = jobsList.map(job => {
    if (job.id === id) {
      return { ...job, company, position };
    }
    return job;
  });

  await writeJobsToFile(jobsList);

  res.status(200).json({
    message: 'Job updated successfully',
    data: job,
    success: true
  });
});

// Delete a job by ID
app.delete('/api/v1/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const job = jobsList.find(job => job.id === id);

  if (!job) {
    return res.status(404).json({
      message: 'Job not found',
      success: false
    });
  }

  jobsList = jobsList.filter(job => job.id !== id);

  await writeJobsToFile(jobsList);

  res.status(200).json({
    message: 'Job deleted successfully',
    success: true
  });
});

// Handle undefined routes - Not Found middleware
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'This route does not exist!',
    success: false
  });
});

// Global error handler - Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    success: false
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
