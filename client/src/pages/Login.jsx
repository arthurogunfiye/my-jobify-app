import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigate
} from 'react-router-dom';
import { FormRow, Logo, SubmitButton } from '../components';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);

  // Create custom FE error validation for password length
  const errors = { message: '' };
  if (user.password.length < 8) {
    errors.message = 'Password must be at least 8 characters long';
    return errors;
  }

  try {
    await customFetch.post('/auth/login', user);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    console.log(error);
    // toast.error(error?.response?.data?.message || 'Something went wrong');
    // return error;
    errors.message = error?.response?.data?.message || 'Something went wrong';
    return errors;
  }
};

const Login = () => {
  const errors = useActionData();
  const navigate = useNavigate();

  const loginTestUser = async () => {
    try {
      const testUser = {
        email: 'test@test.com',
        password: 'Secret12345%'
      };
      await customFetch.post('/auth/login', testUser);
      toast.success('Take a look around the app');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Login</h4>
        {/* Display error message from action if any */}
        {errors?.message && <p style={{ color: 'red' }}>{errors.message}</p>}
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        <SubmitButton submittingText='logging in...' defaultText='login' />

        <button type='button' className='btn btn-block' onClick={loginTestUser}>
          explore the app
        </button>

        <p>
          Not a member yet?{' '}
          <Link to='/register' className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Login;

// Test user details
// email = test@test.com
// password = Secret12345%
