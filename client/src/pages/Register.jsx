import { Form, redirect, Link } from 'react-router-dom';
import { FormRow, Logo, SubmitButton } from '../components';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/register', user);
    toast.success('User registered successfully');
    return redirect('/login');
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || 'Something went wrong');
    return error;
  }
};

const Register = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Register</h4>
        <FormRow labelText='first name' name='name' type='text' />
        <FormRow labelText='last name' name='lastName' type='text' />
        <FormRow name='location' type='text' />
        <FormRow name='email' type='email' />
        <FormRow name='password' type='password' />
        <SubmitButton submittingText='registering...' defaultText='register' />
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
