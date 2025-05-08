import PropTypes from 'prop-types';

/**
 * Loading spinner component with different sizes and colors
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-200 border-t-secondary-600',
    success: 'border-success-100 border-t-success-500',
    warning: 'border-warning-100 border-t-warning-500',
    error: 'border-error-100 border-t-error-500',
    gray: 'border-gray-200 border-t-gray-600',
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'gray']),
  className: PropTypes.string,
};

export default LoadingSpinner;
