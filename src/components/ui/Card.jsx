import PropTypes from 'prop-types';

/**
 * Card component with optional header, footer, and hover effects
 */
const Card = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  hoverable = false,
  bordered = true,
  shadow = 'md',
  padding = 'md',
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Border classes
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  // Hover effect
  const hoverClasses = hoverable ? 'transition-all duration-200 hover:shadow-lg' : '';
  
  return (
    <div 
      className={`${baseClasses} ${borderClasses} ${shadowClasses[shadow]} ${hoverClasses} ${className}`}
      {...props}
    >
      {/* Card header */}
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-5 py-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Card body */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {/* Card footer */}
      {footer && (
        <div className="border-t border-gray-200 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  hoverable: PropTypes.bool,
  bordered: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
};

export default Card;
