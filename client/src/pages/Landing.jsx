import { Link, useLoaderData } from 'react-router-dom';
import Wrapper from '../assets/wrappers/LandingPage';
import main from '../assets/images/main.svg';
import { Logo } from '../components';

export const loader = async () => {
  return null;
};

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
            molestias similique laboriosam, mollitia accusantium vero recusandae
            delectus aut soluta consequatur, voluptate, asperiores veniam
            reprehenderit facilis necessitatibus odit esse! Perspiciatis, saepe.
          </p>
          <Link to='/register' className='btn register-link'>
            register
          </Link>
          <Link to='/login' className='btn'>
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
};

export default Landing;
