import { redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ params }) => {
  const { id } = params;
  try {
    await customFetch.delete(`/jobs/${id}`);
    toast.success('Job deleted successfully');
  } catch (error) {
    console.error('Error deleting job:', error);
    toast.error(error?.response?.data?.message || 'Error deleting job');
  }
  return redirect('/dashboard/all-jobs');
};
