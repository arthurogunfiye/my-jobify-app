import { FormRow, SubmitButton } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import FormRowSelect from '../components/FormRowSelect';

export const action =
  queryClient =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post('/jobs', data);
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job added successfully!');
      return redirect('all-jobs');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      return error;
    }
  };

const AddJob = () => {
  const { user } = useOutletContext();

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>Add Job</h4>
        <div className='form-center'>
          <FormRow type='text' name='position' />
          <FormRow type='text' name='company' />
          <FormRow
            type='text'
            name='jobLocation'
            labelText='job location'
            defaultValue={user.location}
          />
          <FormRowSelect
            name='jobStatus'
            labelText='job status'
            list={Object.values(JOB_STATUS)}
            defaultValue={JOB_STATUS.PENDING}
          />
          <FormRowSelect
            name='jobType'
            labelText='job type'
            list={Object.values(JOB_TYPE)}
            defaultValue={JOB_TYPE.FULL_TIME}
          />
          <SubmitButton
            formBtn
            submittingText='submitting...'
            defaultText='submit'
          />
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddJob;
