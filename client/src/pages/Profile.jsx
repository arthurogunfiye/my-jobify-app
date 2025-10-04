import { FormRow, SubmitButton } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, redirect, useOutletContext } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action =
  queryClient =>
  async ({ request }) => {
    const formData = await request.formData();

    const file = formData.get('avatar');

    if (file && file.size > 500 * 1024) {
      toast.error('File size exceeds 0.5MB');
      return null;
    }

    try {
      await customFetch.patch('/users/update-user', formData);
      queryClient.invalidateQueries(['user']);
      toast.success('User updated successfully!');
      return redirect('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      return null;
    }
  };

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;

  return (
    <Wrapper>
      <Form method='post' className='form' encType='multipart/form-data'>
        <h4 className='form-title'>profile</h4>
        <div className='form-center'>
          <div className='form-row'>
            <label htmlFor='avatar' className='form-label'>
              Select an image (Max: 0.5MB)
            </label>
            <input
              type='file'
              name='avatar'
              id='avatar'
              className='form-input'
              accept='image/*'
            />
          </div>
          <FormRow type='text' name='name' defaultValue={name} />
          <FormRow
            type='text'
            name='lastName'
            defaultValue={lastName}
            labelText='last name'
          />
          <FormRow type='email' name='email' defaultValue={email} />
          <FormRow
            type='text'
            name='location'
            defaultValue={location}
            labelText='job location'
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

export default Profile;

// We have to send the data as FormData because we are sending an image file
// along with other text data. The default encoding type for forms is
// application/x-www-form-urlencoded, which cannot handle file uploads.
// Therefore, we need to set the encoding type to multipart/form-data
// to properly send the file along with the other form data.
