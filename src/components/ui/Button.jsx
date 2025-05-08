import PropTypes from 'prop-types';
import { colors } from '../../styles/designSystem';

/**
 * Button component with variants: primary, secondary, outline, ghost
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  icon,
  iconPosition = 'right',
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: `bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `text-primary-500 hover:bg-primary-50 focus:ring-primary-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-error-500 hover:bg-error-600 text-white focus:ring-error-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    success: `bg-success-500 hover:bg-success-600 text-white focus:ring-success-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    warning: `bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Icon spacing
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={{
        // Inline styles for colors not in Tailwind
        '--tw-ring-color': variant === 'primary' ? colors.primary[500] : 
                          variant === 'secondary' ? colors.secondary[500] : 
                          variant === 'danger' ? colors.error[500] :
                          variant === 'success' ? colors.success[500] :
                          variant === 'warning' ? colors.warning[500] :
                          colors.primary[500],
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={iconSpacing}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={iconSpacing}>{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;
