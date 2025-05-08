import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Input component with label, error message, and optional icon
 */
const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine the actual input type (for password toggle)
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  // Base classes
  const baseInputClasses = 'block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
  
  // Error classes
  const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Icon padding
  const iconPaddingClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  // Password toggle padding
  const passwordPaddingClasses = type === 'password' ? 'pr-10' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Icon (left position) */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Input element */}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${baseInputClasses} ${errorClasses} ${disabledClasses} ${widthClasses} ${iconPaddingClasses} ${passwordPaddingClasses}`}
          {...props}
        />
        
        {/* Icon (right position) */}
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-400" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      
      {/* Error message or helper text */}
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
};

export default Input;
