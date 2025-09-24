import { Router } from 'express';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats
} from '../controllers/jobs.controllers.js';
import {
  jobValidationRules,
  validateIdParam
} from '../validation/validators.js';
import validate from '../middleware/validation.middleware.js';
import { checkForTestUser } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllJobs);
router.get('/stats', showStats);
router.get('/:id', validateIdParam(), validate, getJob);
router.post('/', checkForTestUser, jobValidationRules(), validate, createJob);
router.patch(
  '/:id',
  checkForTestUser,
  jobValidationRules(),
  validateIdParam(),
  validate,
  updateJob
);
router.delete('/:id', checkForTestUser, validateIdParam(), validate, deleteJob);

export default router;

// Alternative way to setup the routes
// router.route('/').get(getAllJobs).post(createJob);
// router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);
