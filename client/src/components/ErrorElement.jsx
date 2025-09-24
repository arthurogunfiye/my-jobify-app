import { useRouteError } from 'react-router-dom';

const ErrorElement = () => {
  const error = useRouteError();

  return <h4>There was an error: {error.message}</h4>;
};

export default ErrorElement;
