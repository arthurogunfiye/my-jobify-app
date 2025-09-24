import { useNavigation } from 'react-router-dom';

const SubmitButton = ({ formBtn, submittingText, defaultText }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <button
      type='submit'
      className={`btn btn-block ${formBtn && 'form-btn'}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? submittingText : defaultText}
    </button>
  );
};

export default SubmitButton;
