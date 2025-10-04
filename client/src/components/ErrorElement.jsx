import { useRouteError } from 'react-router-dom';

const ErrorElement = () => {
  const error = useRouteError();

  return (
    <>
      <h4>Error! Something ain't right with the app!</h4>
      <h4 style={{ marginTop: '2rem' }}>{error.message}</h4>
    </>
  );
};

export default ErrorElement;
