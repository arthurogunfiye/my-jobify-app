import { FormRow, FormRowSelect, SubmitButton } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async ({ params }) => {
  const { id } = params;
  try {
    const { data } = await customFetch.get(`/jobs/${id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Something went wrong');
    return redirect('/dashboard/all-jobs');
  }
};

export const action = async ({ request, params }) => {
  const { id } = params;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/jobs/${id}`, data);
    toast.success('Job updated successfully');
    return redirect('/dashboard/all-jobs');
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Something went wrong');
    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();
  const { position, company, jobLocation, jobType, jobStatus } = job;

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>Edit Job</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' defaultValue={position} />
          <FormRow type='text' name='company' defaultValue={company} />
          <FormRow
            type='text'
            name='jobLocation'
            labelText='job location'
            defaultValue={jobLocation}
          />
          <FormRowSelect
            name='jobType'
            list={Object.values(JOB_TYPE)}
            defaultValue={jobType}
            labelText='job type'
          />
          <FormRowSelect
            name='jobStatus'
            list={Object.values(JOB_STATUS)}
            defaultValue={jobStatus}
            labelText='job status'
          />
          <SubmitButton
            formBtn
            submittingText='saving changes...'
            defaultText='save changes'
          />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;
