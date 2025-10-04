import { Link, useRouteError } from 'react-router-dom';
import img from '../assets/images/not-found.svg';
import Wrapper from '../assets/wrappers/ErrorPage';

const Error = () => {
  const error = useRouteError();

  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={img} alt='not found' />
          <h3>Page Not Found</h3>
          <p>The page you are looking for does not exist</p>
          <div>
            <Link to='/dashboard'>Back Home</Link>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h4>Something went wrong! 💥</h4>
    </Wrapper>
  );
};

export default Error;
