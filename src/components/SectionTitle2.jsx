import PropTypes from "prop-types";

/**
 * Section title component with optional subtitle and alignment options
 */
const SectionTitle = ({
  title,
  subtitle,
  align = 'left',
  size = 'lg',
  className = '',
  divider = false,
  accentColor = 'primary'
}) => {
  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
  };

  // Accent color classes
  const accentColorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    gray: 'text-gray-700',
  };

  return (
    <div className={`mb-8 ${alignClasses[align]} ${className}`}>
      <h2 className={`font-bold ${sizeClasses[size]} ${accentColorClasses[accentColor]}`}>
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-gray-600 text-lg">
          {subtitle}
        </p>
      )}

      {divider && (
        <div className={`mt-4 h-1 w-20 bg-${accentColor}-500 ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''}`}></div>
      )}
    </div>
  );
};

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  divider: PropTypes.bool,
  accentColor: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'gray']),
};

export default SectionTitle;