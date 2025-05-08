import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

function ErrorDisplay({ 
  title = "An error occurred", 
  message = "Something went wrong. Please try again later.",
  showHomeButton = true,
  showRetryButton = false,
  onRetry = null
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-lg shadow-md">
      <div className="text-red-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <div className="flex gap-4">
        {showHomeButton && (
          <Link to="/">
            <PrimaryButton
              buttonName="Go Home"
              buttonTextColor="text-white"
              buttonBGColor="bg-green-600"
            />
          </Link>
        )}
        {showRetryButton && onRetry && (
          <PrimaryButton
            buttonName="Retry"
            buttonTextColor="text-white"
            buttonBGColor="bg-blue-600"
            onClick={onRetry}
          />
        )}
      </div>
    </div>
  );
}

ErrorDisplay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  showHomeButton: PropTypes.bool,
  showRetryButton: PropTypes.bool,
  onRetry: PropTypes.func
};

export default ErrorDisplay;
