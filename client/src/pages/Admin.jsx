import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';
import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import { StatsCard } from '../components';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/admin/application-stats');
    return data;
  } catch (error) {
    toast.error('You are not authorised to access this page');
    return redirect('/dashboard');
  }
};

const Admin = () => {
  const { jobs, users } = useLoaderData();

  return (
    <Wrapper>
      <StatsCard
        title={users === 1 ? 'current user' : 'current users'}
        count={users}
        color='#e9b949'
        bcg='#fcefc7'
        icon={<FaSuitcaseRolling />}
      />
      <StatsCard
        title={jobs <= 1 ? 'job posted' : 'jobs posted'}
        count={jobs}
        color='#647acb'
        bcg='#e0e8f9'
        icon={<FaCalendarCheck />}
      />
    </Wrapper>
  );
};

export default Admin;
